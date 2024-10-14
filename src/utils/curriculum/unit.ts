export function logErrorMessage(error: unknown) {
  if (process.env.NODE_ENV !== "test") {
    console.log(error instanceof Error ? error.message : error);
  }
}
