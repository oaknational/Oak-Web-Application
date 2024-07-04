const consentClientMock = jest.requireActual("@oaknational/oak-consent-client");

class OakConsentClient extends consentClientMock.MockOakConsentClient {
  constructor() {
    super({
      policyConsents: [],
      requireInteraction: false,
    });
  }
}

module.exports = {
  ...consentClientMock,
  OakConsentClient,
};
