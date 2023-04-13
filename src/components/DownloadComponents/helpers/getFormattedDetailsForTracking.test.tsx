import getFormattedDetailsForTracking from "./getFormattedDetailsForTracking";

describe("getFormattedDetailsForTracking", () => {
  it("should return correct school details for homeschool option", () => {
    const schoolDetailsForTracking = getFormattedDetailsForTracking({
      school: "homeschool",
      selectedResources: ["presentation", "intro-quiz-questions"],
    });

    expect(schoolDetailsForTracking).toStrictEqual({
      schoolOption: "Homeschool",
      schoolName: "",
      schoolUrn: 0,
      selectedResourcesForTracking: ["slide deck", "starter quiz questions"],
    });
  });

  it("should return correct school details for not listed option", () => {
    const schoolDetailsForTracking = getFormattedDetailsForTracking({
      school: "notListed",
      selectedResources: ["presentation", "worksheet-pdf"],
    });

    expect(schoolDetailsForTracking).toStrictEqual({
      schoolOption: "Not listed",
      schoolName: "",
      schoolUrn: 0,
      selectedResourcesForTracking: ["slide deck", "worksheet pdf"],
    });
  });

  it("should return correct school details for selected school option", () => {
    const schoolDetailsForTracking = getFormattedDetailsForTracking({
      school: "123456-London High School",
      selectedResources: ["presentation", "worksheet-pdf"],
    });

    expect(schoolDetailsForTracking).toStrictEqual({
      schoolOption: "Selected school",
      schoolName: "London High School",
      schoolUrn: 123456,
      selectedResourcesForTracking: ["slide deck", "worksheet pdf"],
    });
  });

  it("should return correctly mapped selected resources", () => {
    const schoolDetailsForTracking = getFormattedDetailsForTracking({
      school: "homeschool",
      selectedResources: [
        "presentation",
        "intro-quiz-questions",
        "intro-quiz-answers",
        "exit-quiz-questions",
        "exit-quiz-answers",
        "worksheet-pdf",
        "worksheet-pptx",
      ],
    });

    expect(schoolDetailsForTracking).toStrictEqual({
      schoolOption: "Homeschool",
      schoolName: "",
      schoolUrn: 0,
      selectedResourcesForTracking: [
        "slide deck",
        "starter quiz questions",
        "starter quiz answers",
        "exit quiz questions",
        "exit quiz answers",
        "worksheet pdf",
        "worksheet pptx",
      ],
    });
  });
});
