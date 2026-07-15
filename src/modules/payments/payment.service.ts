import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
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
    const userId = session.metadata?.userId;

    if (session.payment_status !== "paid") {
      throw new Error("Payment process incomplete.");
    }
    if (!bookingId || !userId) {
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
          userId,
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

export const paymentService = {
  createCheckoutSessionIntoDB,
  handleWebhook,
};
