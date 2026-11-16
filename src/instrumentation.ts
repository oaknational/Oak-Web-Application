export async function register() {
  console.log("Next.js instrumentation register() called", {
    runtime: process.env.NEXT_RUNTIME,
  });

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
}
