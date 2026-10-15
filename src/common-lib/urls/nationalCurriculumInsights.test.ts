import {
  nationalCurriculumInsightsHubHref,
  nationalCurriculumInsightsGuidanceHref,
  nationalCurriculumInsightsSubjectHref,
  nationalCurriculumInsightsSubjectPhaseHref,
  nationalCurriculumInsightsSubjectPhaseKeyStageHref,
  nationalCurriculumInsightsTabHref,
  nationalCurriculumInsightsRouteHref,
  parseNationalCurriculumInsightsRoute,
  parseCurriculumChangeExplainedRoute,
} from "./nationalCurriculumInsights";

describe("National Curriculum Insights URLs", () => {
  it("builds the hub and subject-first page URLs", () => {
    expect(nationalCurriculumInsightsHubHref()).toBe(
      "/curriculum-change-explained",
    );
    expect(nationalCurriculumInsightsGuidanceHref()).toBe(
      "/curriculum-change-explained/guidance",
    );
    expect(nationalCurriculumInsightsSubjectHref("science")).toBe(
      "/curriculum-change-explained/science",
    );
    expect(
      nationalCurriculumInsightsSubjectPhaseHref("science", "primary"),
    ).toBe("/curriculum-change-explained/science/primary");
    expect(nationalCurriculumInsightsTabHref("science", "overview")).toBe(
      "/curriculum-change-explained/science",
    );
    expect(nationalCurriculumInsightsTabHref("science", "secondary")).toBe(
      "/curriculum-change-explained/science/secondary",
    );
    expect(
      nationalCurriculumInsightsSubjectPhaseKeyStageHref(
        "science",
        "primary",
        "key-stage-1",
      ),
    ).toBe("/curriculum-change-explained/science/primary/ks1");
  });

  it("parses hub, subject, phase and key-stage routes", () => {
    expect(parseNationalCurriculumInsightsRoute(undefined)).toEqual({
      kind: "hub",
    });
    expect(parseNationalCurriculumInsightsRoute([])).toEqual({ kind: "hub" });
    expect(parseNationalCurriculumInsightsRoute(["guidance"])).toEqual({
      kind: "guidance",
    });
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
      "/curriculum-change-explained",
    );
    expect(nationalCurriculumInsightsRouteHref({ kind: "guidance" })).toBe(
      "/curriculum-change-explained/guidance",
    );
    expect(
      nationalCurriculumInsightsRouteHref({
        kind: "subject",
        subjectSlug: "science",
      }),
    ).toBe("/curriculum-change-explained/science");
    expect(
      nationalCurriculumInsightsRouteHref({
        kind: "subjectPhase",
        subjectSlug: "science",
        phase: "primary",
      }),
    ).toBe("/curriculum-change-explained/science/primary");
    expect(
      nationalCurriculumInsightsRouteHref({
        kind: "subjectPhaseKeyStage",
        subjectSlug: "science",
        phase: "secondary",
        keyStageSlug: "key-stage-3",
      }),
    ).toBe("/curriculum-change-explained/science/secondary/ks3");
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

  it.each([
    ["primary", "ks1", "key-stage-1"],
    ["primary", "ks2", "key-stage-2"],
    ["secondary", "ks3", "key-stage-3"],
    ["secondary", "ks4", "key-stage-4"],
  ])("parses the %s %s route", (phase, pathSlug, keyStageSlug) => {
    const route = parseCurriculumChangeExplainedRoute([
      "science",
      phase,
      pathSlug,
    ]);

    expect(route).toEqual({
      kind: "subjectPhaseKeyStage",
      subjectSlug: "science",
      phase,
      keyStageSlug,
    });
    expect(nationalCurriculumInsightsRouteHref(route!)).toBe(
      `/curriculum-change-explained/science/${phase}/${pathSlug}`,
    );
  });

  it.each(
    [undefined, [], ["guidance"], ["history"], ["history", "primary"]].map(
      (segments) => ({ segments }),
    ),
  )("keeps the existing route kinds for $segments", ({ segments }) => {
    expect(parseCurriculumChangeExplainedRoute(segments)).toEqual(
      parseNationalCurriculumInsightsRoute(segments),
    );
  });

  it.each(
    [
      ["science", "primary", "key-stage-1"],
      ["science", "primary", "ks3"],
      ["science", "secondary", "ks1"],
      ["science", "secondary", "ks5"],
      ["science", "primary", "KS1"],
      ["science", "primary", "ks1", "extra"],
      ["science", "primary", "%"],
      ["science", "primary", "%252f"],
      ["science", "primary", 1],
      ["science", "primary", "k".repeat(101)],
      ["%2e%2e", "primary", "ks1"],
      ["science", "primary%2fsecondary", "ks1"],
    ].map((segments) => ({ segments })),
  )("rejects invalid canonical segments $segments", ({ segments }) => {
    expect(parseCurriculumChangeExplainedRoute(segments)).toBeNull();
  });

  it("decodes canonical segments once", () => {
    expect(
      parseCurriculumChangeExplainedRoute(["sc%69ence", "pr%69mary", "ks%31"]),
    ).toEqual({
      kind: "subjectPhaseKeyStage",
      subjectSlug: "science",
      phase: "primary",
      keyStageSlug: "key-stage-1",
    });
  });
});
