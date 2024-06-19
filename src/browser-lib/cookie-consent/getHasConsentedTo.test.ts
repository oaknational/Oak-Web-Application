import "../../__tests__/__helpers__/LocalStorageMock";

import getHasConsentedTo from "./getHasConsentedTo";
import { consentClient } from "./consentClient";

describe("getHasConsentedTo", () => {
  test("checks consent for the appropriate policy for the given service", () => {
    jest.spyOn(consentClient, "getConsent").mockReturnValue("granted");

    expect(getHasConsentedTo("posthog")).toBe("granted");
    expect(consentClient.getConsent).toHaveBeenCalledWith("statistics");
  });
});
