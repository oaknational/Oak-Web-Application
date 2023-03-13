import getDownloadFormErrorMessage from "./getDownloadFormErrorMessage";

describe("getDownloadFormErrorMessage", () => {
  it("should return correct error message for one error", () => {
    const errorKeysArray = ["terms"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual(
      "Please accept terms and conditions"
    );
  });

  it("should return correct error message for two error messages", () => {
    const errorKeysArray = ["terms", "email"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual(
      "Please accept terms and conditions and enter a valid email address"
    );
  });

  it("should return correct error message for more than two error messages", () => {
    const errorKeysArray = ["terms", "email", "downloads"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual(
      "Please accept terms and conditions, enter a valid email address and pick at least one resource"
    );
  });

  it("should return correct error message if error keys that don't have messages are passed", () => {
    const errorKeysArray = ["terms", "downloads", "unknown-key"];

    expect(getDownloadFormErrorMessage(errorKeysArray)).toEqual(
      "Please accept terms and conditions and pick at least one resource"
    );
  });
});
