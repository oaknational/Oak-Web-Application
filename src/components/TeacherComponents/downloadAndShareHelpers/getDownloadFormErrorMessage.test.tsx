import getDownloadFormErrorMessage from "./getDownloadFormErrorMessage";

import type { ErrorKeysType } from "@/components/DownloadAndShareComponents/downloadAndShare.types";


describe("getDownloadFormErrorMessage", () => {
  it("should return correct error message for one error", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "accept terms and conditions to continue",
    ]);
  });

  it("should return correct error message for two error messages", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms", "email"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "enter a valid email address",
      "accept terms and conditions to continue",
    ]);
  });

  it("should return correct error message for more than two error messages", () => {
    const errorKeysArray: ErrorKeysType[] = ["terms", "email", "resources"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "select at least one resource to continue",
      "enter a valid email address",
      "accept terms and conditions to continue",
    ]);
  });

  it("should return error message in correct order", () => {
    const errorKeysArray: ErrorKeysType[] = ["email", "resources", "terms"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual([
      "select at least one resource to continue",
      "enter a valid email address",
      "accept terms and conditions to continue",
    ]);
  });
});
