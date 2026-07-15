export type TTechnicianProfileUpdateInput = {
  bio?: string;
  skills?: string[];
  experience?: number;
  pricing?: number;
};

export type TUpdateAvailabilityInput = {
  availabilitySlots: string[];
};


export type TUpdateBookingStatusInput = {
  status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED";
};
