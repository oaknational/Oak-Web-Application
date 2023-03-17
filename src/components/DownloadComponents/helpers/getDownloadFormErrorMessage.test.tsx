import type { ErrorKeysType } from "../downloads.types";

import getDownloadFormErrorMessage from "./getDownloadFormErrorMessage";

describe("getDownloadFormErrorMessage", () => {
  it("should return correct error message for one error", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual(
      "Please accept terms and conditions"
    );
  });

  it("should return correct error message for two error messages", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms", "email"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual(
      "Please enter a valid email address and accept terms and conditions"
    );
  });

  it("should return correct error message for more than two error messages", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms", "email", "downloads"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual(
      "Please enter a valid email address, accept terms and conditions and pick at least one resource"
    );
  });

  it("should return error message in correct order", () => {
    const errorKeysArray: ErrorKeysType[] = ["email", "downloads", "terms"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual(
      "Please enter a valid email address, accept terms and conditions and pick at least one resource"
    );
  });
});
