import OakError from "@/errors/OakError";

export const handleInnerError = (innerError: unknown) => {
  if (
    innerError instanceof OakError &&
    innerError.code === "curriculum-api/not-found"
  ) {
    // Let the lesson remain undefined, so the redirect logic below can run
  } else {
    // For other types of errors, rethrow
    throw innerError;
  }
};
