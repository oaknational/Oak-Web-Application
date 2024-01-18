import { CookieConsents } from "../CookieConsentProvider";

import { fromTuples, toTuples } from "./useConfirmicConsents";

describe("toTuples", () => {
  it("it should convert to an array of tuples", () => {
    const value: CookieConsents = {
      strictlyNecessary: {
        state: "enabled",
        version: "3.0.0",
      },
      embeddedContent: {
        state: "enabled",
        version: "5.0.0",
      },
      statistics: {
        state: "enabled",
        version: "5.0.0",
      },
    };
    const expected = [
      [
        "metomic-consented-pol:3c779fd2-9d6b-4613-8eed-e746cb669d7e",
        '{"enabled":true,"version":"3.0.0"}',
      ],
      [
        "metomic-consented-pol:68beb01a-65f3-481d-b9db-be05ad95c5a1",
        '{"enabled":true,"version":"5.0.0"}',
      ],
      [
        "metomic-consented-pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
        '{"enabled":true,"version":"5.0.0"}',
      ],
    ];
    const tuples = toTuples(value);
    expect(tuples).toMatchObject(expected);
  });
});
describe("fromTuples", () => {
  it("it should convert from array of tuples to a CookieConsents", () => {
    const tuples = [
      [
        "metomic-consented-pol:3c779fd2-9d6b-4613-8eed-e746cb669d7e",
        '{"enabled":true,"version":"3.0.0"}',
      ],
      [
        "metomic-consented-pol:68beb01a-65f3-481d-b9db-be05ad95c5a1",
        '{"enabled":true,"version":"5.0.0"}',
      ],
      [
        "metomic-consented-pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
        '{"enabled":true,"version":"5.0.0"}',
      ],
    ];
    const expected: CookieConsents = {
      strictlyNecessary: {
        state: "enabled",
        version: "3.0.0",
      },
      embeddedContent: {
        state: "enabled",
        version: "5.0.0",
      },
      statistics: {
        state: "enabled",
        version: "5.0.0",
      },
    };
    const consents = fromTuples(tuples);
    expect(consents).toMatchObject(expected);
  });
});
