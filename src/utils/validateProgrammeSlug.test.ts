import { validateProgrammeSlug } from "./validateProgrammeSlug";

describe("validateProgrammeSlug", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should throw an error if the programmeSlug is too long", () => {
    expect(() => {
      validateProgrammeSlug("abracodabra-".repeat(100));
    }).toThrow("programmeSlug is too long. Max length is 100");
  });

  it.each([
    "english-primary-year-1",
    "english-primary-ks1",
    "english-secondary-year-10-aqa",
    "english-secondary-year-10-foundation",
    "english-secondary-year-10-foundation-aqa",
    "english-secondary-year-10-aqa-foundation",
    "combined-science-secondary-year-10",
    "combined-science-secondary-year-10-aqa-foundation",
    "english-secondary-year-10-l",
  ])("should validate a valid programmeSlug", (slug) => {
    expect(() => {
      validateProgrammeSlug(slug);
    }).not.toThrow();
  });

  it.each([
    "invalid-programme-slug",
    "test-slug-secondary-year-10",
    "english-boo-year-10",
    "english-secondary-ks14",
    "english-secondary-year-10-ks1",
  ])("should throw an error if the programmeSlug is invalid", (slug) => {
    expect(() => {
      validateProgrammeSlug(slug);
    }).toThrow();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
