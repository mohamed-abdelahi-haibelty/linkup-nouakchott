import { EventTag } from "@prisma/client";
import { z } from "zod";

// International phone number validation - requires country code
const internationalPhoneRegex = /^\+\d{10,15}$/;

export const eventFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .max(255)
      .min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .trim()
      .max(20000)
      .min(10, "Description is required"),
    imageUrl: z.url("Must be a valid URL"),
    capacity: z.coerce
      .number()
      .int()
      .max(100000)
      .min(1, "Capacity must be at least 1"),
    location: z.string().trim().max(255).min(3, "Location is required"),
    tag: z.enum(EventTag).optional(),
    startTime: z.date("Start time is required"),
    endTime: z.date("end time is required"),
    registrationDeadline: z.date("registration deadline is required"),
    contactPhone: z
      .string()
      .regex(
        internationalPhoneRegex,
        "Phone must include country code (e.g., +222 for Mauritania, +212 for Morocco)",
      ),
  })
  .superRefine((data, ctx) => {
    // time logic
    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time",
      });
    }
    if (data.registrationDeadline > data.startTime) {
      ctx.addIssue({
        code: "custom",
        path: ["registrationDeadline"],
        message: "Registration deadline must be on or before start time",
      });
    }
  });

export type EventFormInput = z.infer<typeof eventFormSchema>;
