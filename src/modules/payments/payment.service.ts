import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { Role } from "../../../generated/prisma/enums";
import Stripe from "stripe";

const createCheckoutSessionIntoDB = async (
  userId: string,
  bookingId: string,
) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
      include: {
        service: true,
      },
    });

    if (booking.customerId !== userId) {
      throw new Error("Unauthorized access to this booking!");
    }

    if (booking.status !== "ACCEPTED") {
      throw new Error("Payment is only allowed for accepted bookings.");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(booking.service.price * 100),
            product_data: {
              name: booking.service.name,
              description: `FixItNow Service - Booking Date: ${booking.bookingDate}`,
            },
          },
        },
      ],
      metadata: {
        bookingId: booking.id,
        userId: booking.customerId,
      },
      success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.client_url}/payment/cancel`,
    });

    return session.url;
  });

  return transactionResult;
};

const handleManualPaymentConfirm = async (bookingId: string) => {
  if (!bookingId) {
    throw new Error("Booking ID is required to confirm payment");
  }

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { service: true },
  });

  return await prisma.$transaction(async (tx) => {
    const existingPayment = await tx.payment.findFirst({
      where: { bookingId },
    });

    if (existingPayment) {
      return existingPayment;
    }

    const payment = await tx.payment.create({
      data: {
        bookingId,
        amount: booking.service.price,
        provider: "STRIPE",
        status: "COMPLETED",
        transactionId: `mock_tx_${Date.now()}`,
        method: "CARD",
        paidAt: new Date(),
      },
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: { status: "PAID" },
    });

    return payment;
  });
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret as string,
    );
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (session.payment_status !== "paid") {
      throw new Error("Payment process incomplete.");
    }
    if (!bookingId) {
      throw new Error("Required metadata missing from Stripe session.");
    }

    await prisma.$transaction(async (tx) => {
      const existingPayment = await tx.payment.findFirst({
        where: {
          bookingId,
        },
      });

      if (existingPayment) {
        return;
      }

      await tx.payment.create({
        data: {
          bookingId,
          amount: (session.amount_total ?? 0) / 100,
          provider: "STRIPE",
          status: "COMPLETED",
          transactionId: session.payment_intent as string,
          method: "CARD",
          paidAt: new Date(),
        },
      });

      await tx.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status: "PAID",
        },
      });
    });
  }
};

const getAllPaymentsFromDB = async (userId: string, role: string) => {
  let queryFilter = {};

  if (role === Role.CUSTOMER) {
    queryFilter = {
      booking: {
        customerId: userId,
      },
    };
  }

  const result = await prisma.payment.findMany({
    where: queryFilter,
    include: {
      booking: {
        include: {
          service: true,
        },
      },
    },
    orderBy: {
      paidAt: "desc",
    },
  });

  return result;
};

const getSinglePaymentFromDB = async (
  paymentId: string,
  userId: string,
  role: string,
) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: {
      id: paymentId,
    },
    include: {
      booking: {
        include: {
          service: true,
        },
      },
    },
  });

  if (role === Role.CUSTOMER && payment.booking.customerId !== userId) {
    throw new Error("Unauthorized access to this payment details!");
  }

  return payment;
};

export const paymentService = {
  createCheckoutSessionIntoDB,
  handleManualPaymentConfirm,
  handleWebhook,
  getAllPaymentsFromDB,
  getSinglePaymentFromDB,
};
