import Bugsnag, { NotifiableError, OnErrorCallback } from "@bugsnag/js";

const apiKey = process.env.BUGSNAG_API_KEY;
const releaseStage = process.env.BUGSNAG_RELEASE_STAGE;

if (!apiKey) {
  throw new Error("BUGSNAG_API_KEY is required");
}

if (!releaseStage) {
  throw new Error("BUGSNAG_RELEASE_STAGE is required");
}

/**
 * Wrapping Bugsnag.notify to ensure error is reported to Bugsnag before process terminated
 * See: https://github.com/bugsnag/bugsnag-js/issues/1360
 */
const bugsnagNotify = (error: NotifiableError, onError: OnErrorCallback) =>
  new Promise((resolve) => Bugsnag.notify(error, onError, resolve));

Bugsnag.start({
  apiKey,
  releaseStage,
});

export async function reportErr(
  err: NotifiableError,
  context: Record<string, unknown>,
) {
  console.error(err);
  console.log("Context:", JSON.stringify(context, null, 2));
  return bugsnagNotify(err, (report) => {
    report.addMetadata("context", context);
  });
}
