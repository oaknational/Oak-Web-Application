import errorReporter from "@/common-lib/error-reporter";

export function createDownloadsErrorReporter(operation: string) {
  return errorReporter(`downloads-${operation}`);
}
