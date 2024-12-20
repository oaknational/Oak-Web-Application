import { buildCurriculumMetadata } from "./curriculumMetadata";

describe("buildCurriculumMetadata", () => {
  it('should return the title string for "overview" tab and "title" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "title",
      tab: "overview",
      keyStages: ["ks3", "ks4"],
      subjectSlug: "Math",
      ks4OptionSlug: "aqa",
    });
    expect(result).toBe("KS3-4 Math AQA Curriculum Plans");
  });

  it('should return the description string for "overview" tab and "description" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "description",
      tab: "overview",
      keyStages: ["ks1", "ks2"],
      subjectSlug: "Science",
    });
    expect(result).toBe(
      "Looking for KS1-2 Science curriculum? We have sequenced curriculum plans, select by key stage. Our free resources are easy to browse and explore.",
    );
  });

  it('should return the title string for "units" tab and "title" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "title",
      tab: "units",
      keyStages: ["ks3", "ks4"],
      subjectSlug: "English",
      ks4OptionSlug: "edexcel",
    });
    expect(result).toBe("KS3-4 English Edexcel Curriculum Unit Sequence");
  });

  it('should return the description string for "units" tab and "description" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "description",
      tab: "units",
      keyStages: ["ks3", "ks4"],
      subjectSlug: "History",
    });
    expect(result).toBe(
      "Explore our free KS3-4 History curriculum unit sequences, easily select units and topics and view in our interactive tool now.",
    );
  });

  it('should return the description string for "download" tab and "description" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "description",
      tab: "downloads",
      keyStages: ["ks3", "ks4"],
      subjectSlug: "History",
    });
    expect(result).toBe(
      "Explore our free KS3-4 History curriculum unit downloads.",
    );
  });

  it('should return the title string for "download" tab and "title" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "title",
      tab: "downloads",
      keyStages: ["ks3", "ks4"],
      subjectSlug: "English",
      ks4OptionSlug: "edexcel",
    });
    expect(result).toBe("KS3-4 English Edexcel Curriculum Downloads");
  });

  it("should throw if invalid", () => {
    expect(() => {
      buildCurriculumMetadata({
        // @ts-expect-error because we want to test for bad values
        metadataType: "foo",
        tab: "downloads",
        keyStages: ["ks3", "ks4"],
        subjectSlug: "English",
        ks4OptionSlug: "edexcel",
      });
    }).toThrow();
  });
});
