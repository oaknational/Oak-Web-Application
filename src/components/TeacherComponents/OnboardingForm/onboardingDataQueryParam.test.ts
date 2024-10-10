import {
  decodeOnboardingDataQueryParam,
  encodeOnboardingDataQueryParam,
} from "./onboardingDataQueryParam";
import type { OnboardingFormProps } from "./OnboardingForm.schema";

const schoolData: OnboardingFormProps = {
  newsletterSignUp: false,
  school: "Grange Hill",
  schoolName: "Grange Hill",
  onSubmit: jest.fn(),
};
const worksInSchoolData: OnboardingFormProps = {
  newsletterSignUp: true,
  worksInSchool: true,
  onSubmit: jest.fn(),
};

describe(encodeOnboardingDataQueryParam, () => {
  it("encodes the onboarding form props as a query param", () => {
    const query = { returnTo: "/home" };
    const newQuery = encodeOnboardingDataQueryParam(query, schoolData);

    expect(newQuery.returnTo).toEqual("/home");
    expect(newQuery.state).toEqual(
      btoa(
        JSON.stringify({
          newsletterSignUp: false,
          school: "Grange Hill",
          schoolName: "Grange Hill",
        }),
      ),
    );
  });

  it("merges with existing state", () => {
    const query = {
      state: btoa(JSON.stringify(worksInSchoolData)),
    };
    const newQuery = encodeOnboardingDataQueryParam(query, schoolData);

    expect(newQuery.state).toEqual(
      btoa(
        JSON.stringify({
          newsletterSignUp: false,
          worksInSchool: true,
          school: "Grange Hill",
          schoolName: "Grange Hill",
        }),
      ),
    );
  });
});

describe(decodeOnboardingDataQueryParam, () => {
  it("decodes the form state from query params", () => {
    const { onSubmit, ...decodedData } = schoolData;

    const result = decodeOnboardingDataQueryParam({
      state: btoa(JSON.stringify(schoolData)),
    });

    expect(result).toEqual(decodedData);
  });
});
