import { EventTag } from "@prisma/client";
import { z } from "zod";

// International phone number validation - requires country code
const internationalPhoneRegex = /^\+\d{10,15}$/;

export const eventFormSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description is required"),
    imageUrl: z.url("Must be a valid URL"),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    price: z.coerce.number().min(0, "Price must be 0 or higher").optional(),
    location: z.string().min(3, "Location is required"),
    tag: z.enum(EventTag).optional(),
    startTime: z.date("Start time is required"),
    endTime: z.date("end time is required"),
    registrationDeadline: z.date("registration deadline is required"),
    isFree: z.boolean().default(true),
    contactPhone: z
      .string()
      .regex(
        internationalPhoneRegex,
        "Phone must include country code (e.g., +222 for Mauritania, +212 for Morocco)"
      ),
  })
  .superRefine((data, ctx) => {
    if (data.isFree && data.price && data.price > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Free events must have a price of 0",
      });
    }
    if (!data.isFree && (data.price === undefined || data.price <= 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Paid events must include a valid price greater than 0",
      });
    }
    // time logic
    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time",
      });
    }
    if (data.registrationDeadline >= data.endTime) {
      ctx.addIssue({
        code: "custom",
        path: ["registrationDeadline"],
        message: "Registration deadline must be before end time",
      });
    }
  });

export type EventFormInput = z.infer<typeof eventFormSchema>;
