import {
  nationalCurriculumInsightsHubHref,
  nationalCurriculumInsightsSubjectHref,
  nationalCurriculumInsightsSubjectPhaseHref,
  nationalCurriculumInsightsSubjectPhaseKeyStageHref,
  nationalCurriculumInsightsTabHref,
  nationalCurriculumInsightsRouteHref,
  parseNationalCurriculumInsightsRoute,
} from "./nationalCurriculumInsights";

describe("National Curriculum Insights URLs", () => {
  it("builds the hub and subject-first page URLs", () => {
    expect(nationalCurriculumInsightsHubHref()).toBe(
      "/teachers/national-curriculum-insights",
    );
    expect(nationalCurriculumInsightsSubjectHref("science")).toBe(
      "/teachers/national-curriculum-insights/science",
    );
    expect(
      nationalCurriculumInsightsSubjectPhaseHref("science", "primary"),
    ).toBe("/teachers/national-curriculum-insights/science/primary");
    expect(nationalCurriculumInsightsTabHref("science", "overview")).toBe(
      "/teachers/national-curriculum-insights/science",
    );
    expect(nationalCurriculumInsightsTabHref("science", "secondary")).toBe(
      "/teachers/national-curriculum-insights/science/secondary",
    );
    expect(
      nationalCurriculumInsightsSubjectPhaseKeyStageHref(
        "science",
        "primary",
        "key-stage-1",
      ),
    ).toBe(
      "/teachers/national-curriculum-insights/science/primary/key-stage-1",
    );
  });

  it("parses hub, subject, phase and key-stage routes", () => {
    expect(parseNationalCurriculumInsightsRoute(undefined)).toEqual({
      kind: "hub",
    });
    expect(parseNationalCurriculumInsightsRoute([])).toEqual({ kind: "hub" });
    expect(parseNationalCurriculumInsightsRoute(["science"])).toEqual({
      kind: "subject",
      subjectSlug: "science",
    });
    expect(
      parseNationalCurriculumInsightsRoute(["physical-education", "secondary"]),
    ).toEqual({
      kind: "subjectPhase",
      subjectSlug: "physical-education",
      phase: "secondary",
    });
    expect(
      parseNationalCurriculumInsightsRoute([
        "science",
        "primary",
        "key-stage-1",
      ]),
    ).toEqual({
      kind: "subjectPhaseKeyStage",
      subjectSlug: "science",
      phase: "primary",
      keyStageSlug: "key-stage-1",
    });
  });

  it("builds a canonical href from every route kind", () => {
    expect(nationalCurriculumInsightsRouteHref({ kind: "hub" })).toBe(
      "/teachers/national-curriculum-insights",
    );
    expect(
      nationalCurriculumInsightsRouteHref({
        kind: "subject",
        subjectSlug: "science",
      }),
    ).toBe("/teachers/national-curriculum-insights/science");
    expect(
      nationalCurriculumInsightsRouteHref({
        kind: "subjectPhase",
        subjectSlug: "science",
        phase: "primary",
      }),
    ).toBe("/teachers/national-curriculum-insights/science/primary");
    expect(
      nationalCurriculumInsightsRouteHref({
        kind: "subjectPhaseKeyStage",
        subjectSlug: "science",
        phase: "secondary",
        keyStageSlug: "key-stage-3",
      }),
    ).toBe(
      "/teachers/national-curriculum-insights/science/secondary/key-stage-3",
    );
  });

  it("rejects phase-first, overview-segment and malformed routes", () => {
    expect(
      parseNationalCurriculumInsightsRoute(["primary", "science"]),
    ).toBeNull();
    expect(
      parseNationalCurriculumInsightsRoute(["science", "overview"]),
    ).toBeNull();
    expect(
      parseNationalCurriculumInsightsRoute(["science", "key-stage-2"]),
    ).toBeNull();
    expect(
      parseNationalCurriculumInsightsRoute(["science", "primary", "extra"]),
    ).toBeNull();
    expect(
      parseNationalCurriculumInsightsRoute([
        "science",
        "primary",
        "key-stage-3",
      ]),
    ).toBeNull();
    expect(parseNationalCurriculumInsightsRoute(["%"])).toBeNull();
    expect(parseNationalCurriculumInsightsRoute(["a".repeat(101)])).toBeNull();
  });

  it("does not construct malformed paths", () => {
    expect(() => nationalCurriculumInsightsSubjectHref("Science")).toThrow(
      "subject slug is invalid",
    );
    expect(() =>
      nationalCurriculumInsightsSubjectPhaseHref("science", "key-stage-2"),
    ).toThrow("phase is invalid");
    expect(() =>
      nationalCurriculumInsightsSubjectPhaseKeyStageHref(
        "science",
        "primary",
        "key-stage-4",
      ),
    ).toThrow("does not belong to the phase");
  });
});
