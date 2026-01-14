import {
  OakGoogleClassroomException,
  ExceptionType,
  ErrorSeverity,
} from "@oaknational/google-classroom-addon/server";

import { isOakGoogleClassroomException } from "./errorHandling";

describe("isOakGoogleClassroomException", () => {
  it("returns true for a valid OakGoogleClassroomException", () => {
    const error = new OakGoogleClassroomException(
      "Access was denied. Please grant permission to continue.",
      ExceptionType.GoogleOAuth,
      {
        code: "access_denied",
        shouldRetry: false,
        severity: ErrorSeverity.Error,
      },
    );

    expect(isOakGoogleClassroomException(error)).toBe(true);
  });

  it("returns true when error has additional properties", () => {
    const error = new OakGoogleClassroomException(
      "Rate limit exceeded",
      ExceptionType.Firestore,
      {
        code: "rate_limit_exceeded",
        shouldRetry: true,
        severity: ErrorSeverity.Warning,
        context: {
          operation: "createAttachment",
          service: ExceptionType.Firestore,
          userId: "123",
          metadata: { documentId: "123" },
        },
      },
    );

    expect(isOakGoogleClassroomException(error)).toBe(true);
  });

  it("returns false for a plain Error", () => {
    const error = new Error("Something went wrong");
    expect(isOakGoogleClassroomException(error)).toBe(false);
  });

  it("returns false for a plain object", () => {
    const error = {
      name: "OakGoogleClassroomException",
      type: "google-oauth",
      severity: "error",
      shouldRetry: false,
    };
    expect(isOakGoogleClassroomException(error)).toBe(false);
  });
});
