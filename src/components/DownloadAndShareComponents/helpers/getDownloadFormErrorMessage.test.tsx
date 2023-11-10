import type { ErrorKeysType } from "../downloadsAndShare.types";

import getDownloadFormErrorMessage from "./getDownloadFormErrorMessage";

describe("getDownloadFormErrorMessage", () => {
  it("should return correct error message for one error", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "accept terms and conditions to download",
    ]);
  });

  it("should return correct error message for two error messages", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms", "email"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "enter a valid email address",
      "accept terms and conditions to download",
    ]);
  });

  it("should return correct error message for more than two error messages", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms", "email", "downloads"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "select at least one resource to download",
      "enter a valid email address",
      "accept terms and conditions to download",
    ]);
  });

  it("should return error message in correct order", () => {
    const errorKeysArray: ErrorKeysType[] = ["email", "downloads", "terms"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "select at least one resource to download",
      "enter a valid email address",
      "accept terms and conditions to download",
    ]);
  });
});
