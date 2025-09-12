import { getAvailableTeachingMaterials } from "./teachingMaterialsConfig";

describe("getAvailableTeachingMaterials", () => {
  const defaultMaterials = [
    "additional-glossary",
    "additional-comprehension",
    "additional-starter-quiz",
    "additional-exit-quiz",
  ];

  it("should return all materials if no subject or key stage is provided", () => {
    const result = getAvailableTeachingMaterials(null, null, null);
    expect(result).toEqual(defaultMaterials);
  });

  it("should return all materials if the subject or key stage has no restrictions", () => {
    const result = getAvailableTeachingMaterials(
      "unknown-subject",
      "unknown-keystage",
      null,
    );
    expect(result).toEqual(defaultMaterials);
  });

  it("should return restricted materials for a specific subject and key stage", () => {
    const result = getAvailableTeachingMaterials("art", "ks1", null);
    expect(result).toEqual([
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ]);
  });

  it("should return restricted materials for another subject and key stage", () => {
    const result = getAvailableTeachingMaterials("science", "ks1", null);
    expect(result).toEqual(["additional-glossary"]);
  });

  it("should return restricted materials for a language subject", () => {
    const result = getAvailableTeachingMaterials("spanish", "ks2", null);
    expect(result).toEqual(["additional-glossary"]);
  });

  it("should return all materials for a subject with no restrictions for the given key stage", () => {
    const result = getAvailableTeachingMaterials("maths", "ks5", null);
    expect(result).toEqual(defaultMaterials);
  });
});

describe("getAvailableTeachingMaterials - Subject Categories", () => {
  it("should handle subject categories correctly", () => {
    const resultArt = getAvailableTeachingMaterials("english", "ks1", [
      "Handwriting",
    ]);
    expect(resultArt).toEqual([
      "additional-glossary",
      "additional-starter-quiz",
    ]);

    const resultMaths = getAvailableTeachingMaterials("maths", "ks2", null);
    expect(resultMaths).toEqual([
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ]);

    const resultScience = getAvailableTeachingMaterials(null, null, [8]);
    expect(resultScience).toEqual([
      "additional-glossary",
      "additional-comprehension",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ]);

    const resultSpanish = getAvailableTeachingMaterials("spanish", "ks3", null);
    expect(resultSpanish).toEqual(["additional-glossary"]);
  });
});

describe("getAvailableTeachingMaterials - Action Types", () => {
  it("should return correct materials for cooking-nutrition", () => {
    const result = getAvailableTeachingMaterials(
      "cooking-nutrition",
      "ks1",
      null,
    );
    expect(result).toEqual([
      "additional-glossary",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ]);
  });

  it("should return correct materials for music", () => {
    const result = getAvailableTeachingMaterials("music", "ks1", null);
    expect(result).toEqual(["additional-glossary"]);
  });
});

describe("getAvailableTeachingMaterials - Actions", () => {
  it("should return glossary for PE practical lessons", () => {
    const actions = { isPePractical: true };
    const result = getAvailableTeachingMaterials(null, null, null, actions);
    expect(result).toEqual(["additional-glossary"]);
  });

  it("should return default materials if actions are not provided", () => {
    const result = getAvailableTeachingMaterials(null, null, null, undefined);
    expect(result).toEqual([
      "additional-glossary",
      "additional-comprehension",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ]);
  });

  it("should return default materials if actions do not match any condition", () => {
    const actions = { isPePractical: false };
    const result = getAvailableTeachingMaterials(null, null, null, actions);
    expect(result).toEqual([
      "additional-glossary",
      "additional-comprehension",
      "additional-starter-quiz",
      "additional-exit-quiz",
    ]);
  });
});
