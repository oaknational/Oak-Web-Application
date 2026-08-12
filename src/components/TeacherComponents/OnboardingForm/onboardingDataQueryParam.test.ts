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
    const query = encodeOnboardingDataQueryParam(null, schoolData);

    expect(decodeOnboardingDataQueryParam(new URLSearchParams(query))).toEqual({
      newsletterSignUp: false,
      school: "Grange Hill",
      schoolName: "Grange Hill",
    });
  });

  it("merges with existing state", () => {
    const newState = decodeOnboardingDataQueryParam(
      new URLSearchParams(
        encodeOnboardingDataQueryParam(
          new URLSearchParams(
            encodeOnboardingDataQueryParam(null, worksInSchoolData),
          ),
          schoolData,
        ),
      ),
    );

    expect(newState).toEqual({
      newsletterSignUp: false,
      worksInSchool: true,
      school: "Grange Hill",
      schoolName: "Grange Hill",
    });
  });

  it("is unicode safe", () => {
    const newState = decodeOnboardingDataQueryParam(
      new URLSearchParams(
        encodeOnboardingDataQueryParam(null, {
          ...schoolData,
          schoolName: "📚",
        }),
      ),
    );

    expect(newState).toEqual(
      expect.objectContaining({
        schoolName: "📚",
      }),
    );
  });
});
