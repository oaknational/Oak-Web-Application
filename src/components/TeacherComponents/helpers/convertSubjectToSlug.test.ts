import { convertSubjectToSlug } from "./convertSubjectToSlug";

describe("convertSubjectToSlug", () => {
  it('should convert "Relationships, sex and health education" to "rshe"', () => {
    expect(
      convertSubjectToSlug("Relationships, sex and health education"),
    ).toBe("rshe-pshe");
  });

  it('should convert "Art and design" to "art"', () => {
    expect(convertSubjectToSlug("Art and design")).toBe("art");
  });
  it("handles one word subjects", () => {
    expect(convertSubjectToSlug("Biology")).toBe("biology");
    expect(convertSubjectToSlug("Chemistry")).toBe("chemistry");
    expect(convertSubjectToSlug("Science")).toBe("science");
  });

  it('should convert "Speech and language therapy" to "speech-and-language-therapy"', () => {
    expect(convertSubjectToSlug("Speech and language therapy")).toBe(
      "speech-and-language-therapy",
    );
  });

  it('should convert "Physical development" to "physical-development"', () => {
    expect(convertSubjectToSlug("Physical development")).toBe(
      "physical-development",
    );
  });

  it('should convert "Creative arts" to "creative-arts"', () => {
    expect(convertSubjectToSlug("Creative arts")).toBe("creative-arts");
  });

  it("should handle multiple hyphens correctly", () => {
    expect(convertSubjectToSlug("Rule of law")).toBe("rule-of-law");
  });
});
