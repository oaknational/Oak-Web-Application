import {
  nationalCurriculumInsightsKeyStageFromSlug,
  nationalCurriculumInsightsKeyStageSlugSchema,
  nationalCurriculumInsightsKeyStagesForPhase,
  nationalCurriculumInsightsPhaseSchema,
  nationalCurriculumInsightsSubjectLookupParamsSchema,
  type NationalCurriculumInsightsKeyStageSlug,
  type NationalCurriculumInsightsPhase,
  type NationalCurriculumInsightsTabKind,
} from "@/common-lib/cms-types/nationalCurriculumInsights";

export const nationalCurriculumInsightsPath =
  "/teachers/national-curriculum-insights";

export type NationalCurriculumInsightsRoute =
  | { kind: "hub" }
  | { kind: "subject"; subjectSlug: string }
  | {
      kind: "subjectPhase";
      subjectSlug: string;
      phase: NationalCurriculumInsightsPhase;
    }
  | {
      kind: "subjectPhaseKeyStage";
      subjectSlug: string;
      phase: NationalCurriculumInsightsPhase;
      keyStageSlug: NationalCurriculumInsightsKeyStageSlug;
    };

const maximumSegmentLength = 100;

const decodeRouteSegment = (segment: unknown): string | null => {
  if (typeof segment !== "string" || segment.length > maximumSegmentLength) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(segment);
    return decoded.length <= maximumSegmentLength ? decoded : null;
  } catch {
    return null;
  }
};

const assertSubjectSlug = (subjectSlug: string): string => {
  const result = nationalCurriculumInsightsSubjectLookupParamsSchema.safeParse({
    subjectSlug,
  });
  if (!result.success) {
    throw new Error("National Curriculum Insights subject slug is invalid");
  }

  return result.data.subjectSlug;
};

const assertPhase = (phase: string): NationalCurriculumInsightsPhase => {
  const result = nationalCurriculumInsightsPhaseSchema.safeParse(phase);
  if (!result.success) {
    throw new Error("National Curriculum Insights phase is invalid");
  }

  return result.data;
};

const assertKeyStageSlug = (
  phase: NationalCurriculumInsightsPhase,
  keyStageSlug: string,
): NationalCurriculumInsightsKeyStageSlug => {
  const result =
    nationalCurriculumInsightsKeyStageSlugSchema.safeParse(keyStageSlug);
  if (!result.success) {
    throw new Error("National Curriculum Insights key stage is invalid");
  }

  const keyStage = nationalCurriculumInsightsKeyStageFromSlug(result.data);
  if (
    !(
      nationalCurriculumInsightsKeyStagesForPhase[phase] as readonly string[]
    ).includes(keyStage)
  ) {
    throw new Error(
      "National Curriculum Insights key stage does not belong to the phase",
    );
  }

  return result.data;
};

export const nationalCurriculumInsightsHubHref = () =>
  nationalCurriculumInsightsPath;

export const nationalCurriculumInsightsSubjectHref = (subjectSlug: string) =>
  `${nationalCurriculumInsightsPath}/${encodeURIComponent(
    assertSubjectSlug(subjectSlug),
  )}`;

export const nationalCurriculumInsightsSubjectPhaseHref = (
  subjectSlug: string,
  phase: string,
) =>
  `${nationalCurriculumInsightsSubjectHref(subjectSlug)}/${encodeURIComponent(
    assertPhase(phase),
  )}`;

export const nationalCurriculumInsightsSubjectPhaseKeyStageHref = (
  subjectSlug: string,
  phase: string,
  keyStageSlug: string,
) => {
  const validPhase = assertPhase(phase);
  return `${nationalCurriculumInsightsSubjectPhaseHref(
    subjectSlug,
    validPhase,
  )}/${encodeURIComponent(assertKeyStageSlug(validPhase, keyStageSlug))}`;
};

export const nationalCurriculumInsightsTabHref = (
  subjectSlug: string,
  tabKind: NationalCurriculumInsightsTabKind,
) =>
  tabKind === "overview"
    ? nationalCurriculumInsightsSubjectHref(subjectSlug)
    : nationalCurriculumInsightsSubjectPhaseHref(subjectSlug, tabKind);

export const nationalCurriculumInsightsRouteHref = (
  route: NationalCurriculumInsightsRoute,
) => {
  switch (route.kind) {
    case "hub":
      return nationalCurriculumInsightsHubHref();
    case "subject":
      return nationalCurriculumInsightsSubjectHref(route.subjectSlug);
    case "subjectPhase":
      return nationalCurriculumInsightsSubjectPhaseHref(
        route.subjectSlug,
        route.phase,
      );
    case "subjectPhaseKeyStage":
      return nationalCurriculumInsightsSubjectPhaseKeyStageHref(
        route.subjectSlug,
        route.phase,
        route.keyStageSlug,
      );
  }
};

/**
 * Parses the optional catch-all route. Subject membership and configured tabs
 * are checked by the route data loader after it reads the CMS hierarchy.
 */
export const parseNationalCurriculumInsightsRoute = (
  segments: unknown,
): NationalCurriculumInsightsRoute | null => {
  if (segments === undefined) {
    return { kind: "hub" };
  }

  if (!Array.isArray(segments) || segments.length > 3) {
    return null;
  }

  const decodedSegments = segments.map(decodeRouteSegment);
  if (decodedSegments.includes(null)) {
    return null;
  }

  if (decodedSegments.length === 0) {
    return { kind: "hub" };
  }

  const subjectResult =
    nationalCurriculumInsightsSubjectLookupParamsSchema.safeParse({
      subjectSlug: decodedSegments[0],
    });
  if (!subjectResult.success) {
    return null;
  }

  if (decodedSegments.length === 1) {
    return {
      kind: "subject",
      subjectSlug: subjectResult.data.subjectSlug,
    };
  }

  const phaseResult = nationalCurriculumInsightsPhaseSchema.safeParse(
    decodedSegments[1],
  );
  if (!phaseResult.success) {
    return null;
  }

  if (decodedSegments.length === 2) {
    return {
      kind: "subjectPhase",
      subjectSlug: subjectResult.data.subjectSlug,
      phase: phaseResult.data,
    };
  }

  const keyStageResult = nationalCurriculumInsightsKeyStageSlugSchema.safeParse(
    decodedSegments[2],
  );
  if (!keyStageResult.success) {
    return null;
  }

  const keyStage = nationalCurriculumInsightsKeyStageFromSlug(
    keyStageResult.data,
  );
  if (
    !(
      nationalCurriculumInsightsKeyStagesForPhase[
        phaseResult.data
      ] as readonly string[]
    ).includes(keyStage)
  ) {
    return null;
  }

  return {
    kind: "subjectPhaseKeyStage",
    subjectSlug: subjectResult.data.subjectSlug,
    phase: phaseResult.data,
    keyStageSlug: keyStageResult.data,
  };
};
