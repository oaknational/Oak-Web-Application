const consentClientMock = jest.requireActual("@oaknational/oak-consent-client");

/**
 * Provides a mock implementation of OakConsentClient so that tests
 * do not try to hit the network
 */
class MockOakConsentClient {
  getState() {
    return {
      policyConsents: [],
      requireInteraction: false,
    };
  }
  logConsents() {
    return Promise.resolve();
  }
  getConsent() {
    return "pending";
  }
  onStateChange() {
    return () => {};
  }
}

module.exports = {
  ...consentClientMock,
  OakConsentClient: MockOakConsentClient,
};
