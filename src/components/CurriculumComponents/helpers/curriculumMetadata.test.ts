import { buildCurriculumMetadata } from "./curriculumMetadata";

describe("buildCurriculumMetadata", () => {
  it('should return the title string for "overview" tab and "title" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "title",
      tab: "overview",
      keyStages: ["ks3", "ks4"],
      subjectSlug: "math",
      subjectTitle: "Math",
      ks4OptionSlug: "aqa",
    });
    expect(result).toBe("KS3-4 math AQA curriculum explainer");
  });

  it('should return the title string for "overview" tab and "title" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "title",
      tab: "overview",
      keyStages: ["ks3", "ks4"],
      subjectSlug: "design-and-technology",
      subjectTitle: "Design and technology",
      ks4OptionSlug: "aqa",
    });
    expect(result).toBe("KS3-4 design and technology AQA curriculum explainer");
  });

  it('should return the description string for "overview" tab and "description" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "description",
      tab: "overview",
      keyStages: ["ks1", "ks2"],
      subjectSlug: "science",
      subjectTitle: "Science",
    });
    expect(result).toBe(
      "Looking for KS1-2 science curriculum? We have sequenced curriculum plans, select by key stage. Our free resources are easy to browse and explore.",
    );
  });

  it('should return the title string for "units" tab and "title" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "title",
      tab: "units",
      keyStages: ["ks3", "ks4"],
      subjectSlug: "english",
      subjectTitle: "English",
      ks4OptionSlug: "edexcel",
      ks4OptionTitle: "Edexcel",
    });
    expect(result).toBe("KS3-4 English Edexcel curriculum unit sequence");
  });

  it('should return the description string for "units" tab and "description" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "description",
      tab: "units",
      keyStages: ["ks3", "ks4"],
      subjectSlug: "history",
      subjectTitle: "History",
    });
    expect(result).toBe(
      "Explore our free KS3-4 history curriculum unit sequences, easily select units and topics and view in our interactive tool now.",
    );
  });

  it('should return the description string for "download" tab and "description" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "description",
      tab: "downloads",
      keyStages: ["ks3", "ks4"],
      subjectSlug: "history",
      subjectTitle: "History",
    });
    expect(result).toBe(
      "Explore our free KS3-4 history curriculum unit downloads.",
    );
  });

  it('should return the title string for "download" tab and "title" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "title",
      tab: "downloads",
      keyStages: ["ks3", "ks4"],
      subjectSlug: "english",
      subjectTitle: "English",
      ks4OptionSlug: "edexcel",
      ks4OptionTitle: "Edexcel",
    });
    expect(result).toBe("KS3-4 English Edexcel curriculum downloads");
  });

  it("should throw if invalid", () => {
    expect(() => {
      buildCurriculumMetadata({
        // @ts-expect-error because we want to test for bad values
        metadataType: "foo",
        tab: "downloads",
        keyStages: ["ks3", "ks4"],
        subjectSlug: "english",
        subjectTitle: "English",
        ks4OptionSlug: "edexcel",
      });
    }).toThrow();
  });
});
