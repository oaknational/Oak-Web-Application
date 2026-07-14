import { z } from "zod";

type EmailSchemaMessages = {
  emptyField: string;
  invalidField: string;
  type?: string;
};

/**
 * Build a reusable email schema with configurable messages
 */
export const createEmailSchema = ({
  emptyField,
  invalidField,
  type,
}: EmailSchemaMessages) => {
  const minLengthSchema = z
    .string({ error: type })
    .min(1, { error: emptyField });
  const emailFormatSchema = z.email({ error: invalidField });

  return z.intersection(minLengthSchema, emailFormatSchema);
};
