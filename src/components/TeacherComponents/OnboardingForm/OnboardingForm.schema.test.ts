import { extendedUseOfOakSchema } from "./OnboardingForm.schema";

describe("extendedUseOfOakSchema", () => {
  const baseData = {
    newsletterSignUp: false,
    school: "000000",
  };

  it("requires a support option to have been selected when continuing", () => {
    expect(() => {
      extendedUseOfOakSchema.parse({ ...baseData, submitMode: "continue" });
    }).toThrow("Please select the ways Oak can support you");
  });

  it("removes support options when skipping", () => {
    expect(
      extendedUseOfOakSchema.parse({
        ...baseData,
        submitMode: "skip",
        curriculumDesign: true,
      }),
    ).not.toMatchObject({
      curriculumDesign: true,
    });
  });
});
