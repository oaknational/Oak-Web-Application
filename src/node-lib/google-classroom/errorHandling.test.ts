import { isOakGoogleClassroomException } from "./errorHandling";

describe("isOakGoogleClassroomException", () => {
  it("returns true for a valid OakGoogleClassroomException", () => {
    const error = {
      name: "OakGoogleClassroomException",
      type: "google-oauth",
      severity: "error",
      shouldRetry: false,
    };

    expect(isOakGoogleClassroomException(error)).toBe(true);
  });

  it("returns true when error has additional properties", () => {
    const error = {
      name: "OakGoogleClassroomException",
      type: "google-oauth",
      severity: "warning",
      shouldRetry: true,
      message: "Rate limit exceeded",
      context: { userId: "123" },
    };

    expect(isOakGoogleClassroomException(error)).toBe(true);
  });

  it("returns false for a plain Error", () => {
    const error = new Error("Something went wrong");

    expect(isOakGoogleClassroomException(error)).toBe(false);
  });

  it("returns false when name is missing", () => {
    const error = {
      type: "firestore",
      severity: "error",
      shouldRetry: false,
    };

    expect(isOakGoogleClassroomException(error)).toBe(false);
  });

  it("returns false when name is not OakGoogleClassroomException", () => {
    const error = {
      name: "SomeOtherException",
      type: "encryption",
      severity: "warning",
      shouldRetry: false,
    };

    expect(isOakGoogleClassroomException(error)).toBe(false);
  });

  it("returns false when type is missing", () => {
    const error = {
      name: "OakGoogleClassroomException",
      severity: "error",
      shouldRetry: false,
    };

    expect(isOakGoogleClassroomException(error)).toBe(false);
  });

  it("returns false when severity is missing", () => {
    const error = {
      name: "OakGoogleClassroomException",
      type: "encryption",
      shouldRetry: false,
    };

    expect(isOakGoogleClassroomException(error)).toBe(false);
  });

  it("returns false when shouldRetry is missing", () => {
    const error = {
      name: "OakGoogleClassroomException",
      type: "firestore",
      severity: "error",
    };

    expect(isOakGoogleClassroomException(error)).toBe(false);
  });

  it("returns false for an empty object", () => {
    expect(isOakGoogleClassroomException({})).toBe(false);
  });
});
