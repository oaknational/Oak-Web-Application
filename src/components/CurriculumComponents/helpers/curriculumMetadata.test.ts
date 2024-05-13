import { buildCurriculumMetadata } from "./curriculumMetadata";

describe("buildCurriculumMetadata", () => {
  it('should return the title string for "overview" tab and "title" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "title",
      tab: "overview",
      keyStagesData: "KS3-4",
      subjectSlug: "Math",
      examboardSlug: "aqa",
    });
    expect(result).toBe("KS3-4 Math AQA Curriculum Plans");
  });

  it('should return the description string for "overview" tab and "description" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "description",
      tab: "overview",
      keyStagesData: "KS1-2",
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
      keyStagesData: "KS3-4",
      subjectSlug: "English",
      examboardSlug: "edexcel",
    });
    expect(result).toBe("KS3-4 English Edexcel Curriculum Unit Sequence");
  });

  it('should return the description string for "units" tab and "description" metadataType', () => {
    const result = buildCurriculumMetadata({
      metadataType: "description",
      tab: "units",
      keyStagesData: "KS3-4",
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
      keyStagesData: "KS3-4",
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
      keyStagesData: "KS3-4",
      subjectSlug: "English",
      examboardSlug: "edexcel",
    });
    expect(result).toBe("KS3-4 English Edexcel Curriculum Downloads");
  });

  it("should throw if invalid", () => {
    expect(() => {
      buildCurriculumMetadata({
        // @ts-expect-error because we want to test for bad values
        metadataType: "foo",
        tab: "downloads",
        keyStagesData: "KS3-4",
        subjectSlug: "English",
        examboardSlug: "edexcel",
      });
    }).toThrow();
  });
});
