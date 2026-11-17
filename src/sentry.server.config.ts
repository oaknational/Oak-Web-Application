import * as Sentry from "@sentry/nextjs";

console.debug("Sentry configuration loaded", {
  hasDsn: Boolean(process.env.SENTRY_DSN),
  environment: process.env.SENTRY_ENVIRONMENT,
});

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT,

    enableLogs: true,

    integrations: [
      Sentry.consoleLoggingIntegration({
        levels: ["log", "warn", "error"],
      }),
    ],

    sendDefaultPii: false,
  });

  Sentry.logger.info("Oak Web Application direct Sentry log test", {
    environment: process.env.SENTRY_ENVIRONMENT,
  });

  console.log("Oak Web Application console logging test");
}
