import type { ErrorKeysType } from "../downloads.types";

import getDownloadFormErrorMessage from "./getDownloadFormErrorMessage";

describe("getDownloadFormErrorMessage", () => {
  it("should return correct error message for one error", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "Accept terms and conditions to download",
    ]);
  });

  it("should return correct error message for two error messages", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms", "email"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "Enter a valid email address",
      "Accept terms and conditions to download",
    ]);
  });

  it.only("should return correct error message for more than two error messages", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms", "email", "downloads"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "Enter a valid email address",
      "Accept terms and conditions to download",
      "Select at least one resource to download",
    ]);
  });

  it("should return error message in correct order", () => {
    const errorKeysArray: ErrorKeysType[] = ["email", "downloads", "terms"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "Enter a valid email address",
      "Accept terms and conditions to download",
      "Select at least one resource to download",
    ]);
  });
});
