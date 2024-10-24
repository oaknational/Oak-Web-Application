import { ZodError } from "zod";

/**
 * Wraps an App router API route handler to catch Zod errors
 *
 * Responds with a 400 status and JSON containing the field errors
 */
export function handleZodValidationErrors<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>,
) {
  return async function validationHandler(...args: T) {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ZodError) {
        return Response.json(error.format(), { status: 400 });
      }

      throw error;
    }
  };
}
