import { logError } from "@/lib/sentry";
import { Prisma } from "@prisma/client";
import "server-only";

export class ActionError extends Error {
  constructor(
    message: string,
    readonly status = 409,
  ) {
    super(message);
  }
}

export function handlePrismaError(error: unknown) {
  if (error instanceof ActionError) {
    return {
      success: false,
      message: error.message,
      code: error.status,
      data: null,
    };
  }
  logError(error);
  const conflict =
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002";
  return {
    success: false,
    message: conflict
      ? "This record already exists."
      : "Could not complete this operation. Please try again.",
    code: conflict ? 409 : 500,
    data: null,
  };
}
