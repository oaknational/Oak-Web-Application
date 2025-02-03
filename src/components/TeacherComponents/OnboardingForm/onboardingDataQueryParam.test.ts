import {
  decodeOnboardingDataQueryParam,
  encodeOnboardingDataQueryParam,
} from "./onboardingDataQueryParam";
import type { OnboardingFormProps } from "./OnboardingForm.schema";

const schoolData: OnboardingFormProps = {
  newsletterSignUp: false,
  school: "Grange Hill",
  schoolName: "Grange Hill",
  onSubmit: vi.fn(),
};
const worksInSchoolData: OnboardingFormProps = {
  newsletterSignUp: true,
  worksInSchool: true,
  onSubmit: vi.fn(),
};

describe(encodeOnboardingDataQueryParam, () => {
  it("encodes the onboarding form props as a query param", () => {
    const query = { returnTo: "/home" };
    const newQuery = encodeOnboardingDataQueryParam(query, schoolData);

    expect(newQuery.returnTo).toEqual("/home");
    expect(decodeOnboardingDataQueryParam(newQuery)).toEqual({
      newsletterSignUp: false,
      school: "Grange Hill",
      schoolName: "Grange Hill",
    });
  });

  it("merges with existing state", () => {
    const newState = decodeOnboardingDataQueryParam(
      encodeOnboardingDataQueryParam(
        encodeOnboardingDataQueryParam({}, worksInSchoolData),
        schoolData,
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
      encodeOnboardingDataQueryParam(
        {},
        {
          ...schoolData,
          schoolName: "📚",
        },
      ),
    );

    expect(newState).toEqual(
      expect.objectContaining({
        schoolName: "📚",
      }),
    );
  });
});
