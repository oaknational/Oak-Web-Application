import { getDedupedPupilLessonOutcome } from "./LessonOverview.view";

describe("isPupilLessonOutcomeInKeyLearningPoints", () => {
  it("should return plo if the pupil lesson outcome is not in the key learning points", () => {
    const result = getDedupedPupilLessonOutcome("pupil lesson outcome", [
      { keyLearningPoint: "key learning point" },
    ]);
    expect(result).toBe("pupil lesson outcome");
  });
  it("should return undefined if pupilLessonOutcome is undefined ", () => {
    const result = getDedupedPupilLessonOutcome(undefined, [
      { keyLearningPoint: "key learning point" },
    ]);
    expect(result).toBe(undefined);
  });
  it("should return plo if the key learning points are undefined", () => {
    const result = getDedupedPupilLessonOutcome(
      "pupil lesson outcome",
      undefined,
    );
    expect(result).toBe("pupil lesson outcome");
  });
  it("should return null if the pupil lesson outcome is in the key learning points", () => {
    const result = getDedupedPupilLessonOutcome("pupil lesson outcome", [
      { keyLearningPoint: "pupil lesson outcome" },
    ]);
    expect(result).toBe(null);
  });
});
