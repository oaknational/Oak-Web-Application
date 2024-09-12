import { getQueryParamsFromOnboardingFormData } from "./getQueryParamsFromOnboardingFormData";

describe("getQueryParamsFromOnboardingFormData", () => {
  it("generates correct query params for school picker data", () => {
    const data = {
      school: "Grange Hill",
      newsletterSignUp: false,
      schoolName: "Grange Hill",
      onSubmit: jest.fn(),
    };
    const query = { returnTo: "/home" };
    const result = getQueryParamsFromOnboardingFormData(data, query);
    expect(result).toEqual(
      "returnTo=%2Fhome&newsletterSignUp=false&schoolName=Grange%2520Hill&school=Grange%2520Hill",
    );
  });
  it("generates correct query params for manual school picker data", () => {
    const data = {
      manualSchoolName: "Grange Hill",
      newsletterSignUp: false,
      schoolAddress: "Grange Hill",
      onSubmit: jest.fn(),
    };
    const query = { returnTo: "/home" };
    const result = getQueryParamsFromOnboardingFormData(data, query);
    expect(result).toEqual(
      "returnTo=%2Fhome&newsletterSignUp=false&schoolAddress=Grange%2520Hill&manualSchoolName=Grange%2520Hill",
    );
  });
});
