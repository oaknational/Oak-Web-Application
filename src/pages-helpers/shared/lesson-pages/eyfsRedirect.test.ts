import { isEyfsPathway, redirectToEyfsPage } from "./eyfsRedirect";

describe("eyfsRedirect", () => {
  describe("redirectToEyfsPage", () => {
    it("returns a permanent redirect to the EYFS page", () => {
      const result = redirectToEyfsPage({
        keyStageSlug: "early-years-foundation-stage",
        subjectSlug: "communication-and-language",
      });

      expect(result).toEqual({
        destination: "/teachers/eyfs/communication-and-language",
        statusCode: 301,
      });
    });
  });

  describe("isEyfsPathway", () => {
    it("returns true for EYFS pathways", () => {
      expect(
        isEyfsPathway({
          keyStageSlug: "early-years-foundation-stage",
          subjectSlug: "communication-and-language",
        }),
      ).toBe(true);
    });

    it("returns false for non-EYFS pathways", () => {
      expect(
        isEyfsPathway({
          keyStageSlug: "ks1",
          subjectSlug: "maths",
        }),
      ).toBe(false);
    });

    it("returns false when pathway is undefined", () => {
      expect(isEyfsPathway(undefined)).toBe(false);
    });
  });
});
