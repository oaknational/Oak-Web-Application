import { isPupilLessonOutcomeInKeyLearningPoints } from "./LessonOverview.view";

describe("isPupilLessonOutcomeInKeyLearningPoints", () => {
  it("should return false if the pupil lesson outcome is not in the key learning points", () => {
    const result = isPupilLessonOutcomeInKeyLearningPoints(
      "pupil lesson outcome",
      [{ keyLearningPoint: "key learning point" }],
    );
    expect(result).toBe(false);
  });
  it("should return false if pupilLessonOutcome is undefined", () => {
    const result = isPupilLessonOutcomeInKeyLearningPoints(undefined, [
      { keyLearningPoint: "key learning point" },
    ]);
    expect(result).toBe(false);
  });
  it("should return false is the key learning points are undefined", () => {
    const result = isPupilLessonOutcomeInKeyLearningPoints(
      "pupil lesson outcome",
      undefined,
    );
    expect(result).toBe(false);
  });
  it("should return true if the pupil lesson outcome is in the key learning points", () => {
    const result = isPupilLessonOutcomeInKeyLearningPoints(
      "pupil lesson outcome",
      [{ keyLearningPoint: "pupil lesson outcome" }],
    );
    expect(result).toBe(true);
  });
});
