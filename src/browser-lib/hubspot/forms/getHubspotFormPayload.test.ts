import getHubspotFormPayload from "./getHubspotFormPayload";

describe("getHubspotFormPayload()", () => {
  test("primary form payload is correct", () => {
    expect(
      getHubspotFormPayload({
        hutk: "hubspotutk value 123",
        data: {
          email: "email value",
          fullName: "full_name value",
          userType: "user_type value",
          oakUserId: "oak_user_id value",
        },
      })
    ).toEqual({
      fields: [
        { name: "email", value: "email value" },
        { name: "full_name", value: "full_name value" },
        { name: "oak_user_id", value: "oak_user_id value" },
        { name: "user_type", value: "user_type value" },
      ],
      context: {
        hutk: "hubspotutk value 123",
        pageUri: "http://localhost/",
        pageName: "",
      },
    });
  });
  test("fallback form payload is correct", () => {
    expect(
      getHubspotFormPayload({
        hutk: "hubspotutk value 456",
        data: {
          emailTextOnly: "email value",
          fullName: "full_name value",
          userType: "user_type value",
          oakUserId: "oak_user_id value",
        },
      })
    ).toEqual({
      fields: [
        { name: "email_text_only", value: "email value" },
        { name: "full_name", value: "full_name value" },
        { name: "oak_user_id", value: "oak_user_id value" },
        { name: "user_type", value: "user_type value" },
      ],
      context: {
        hutk: "hubspotutk value 456",
        pageUri: "http://localhost/",
        pageName: "",
      },
    });
  });
});
