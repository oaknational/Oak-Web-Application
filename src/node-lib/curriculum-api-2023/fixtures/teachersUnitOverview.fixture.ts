import { TeachersUnitOverviewData } from "../queries/teachersUnitOverview/teachersUnitOverview.schema";

const teachersUnitOverviewFixture = (
  partial?: Partial<TeachersUnitOverviewData>,
): TeachersUnitOverviewData => {
  return {
    unitvariantId: 1,
    unitDescription: "Unit about cells",
    unitIndex: 1,
    unitCount: 10,
    yearSlug: "year-7",
    unitTitle: "Cells",
    programmeSlug: "biology-secondary-ks3",
    unitSlug: "cells",
    keyStageSlug: "ks3",
    keyStageTitle: "Key Stage 3",
    subjectSlug: "biology",
    subjectTitle: "Biology",
    phaseSlug: "secondary",
    phaseTitle: "Secondary",
    pathwayDisplayOrder: null,
    pathwaySlug: null,
    tierSlug: null,
    tierTitle: null,
    pathwayTitle: null,
    yearTitle: "Year 7",
    year: "7",
    examBoardTitle: null,
    examBoardSlug: null,
    lessons: [],
    nextUnit: { slug: "unit-2", title: "Unit 2" },
    prevUnit: null,
    tierOptionToggles: [],
    subjectOptionToggles: [],
    threads: ["Thread 1", "Thread 2", "Thread 3"],
    whyThisWhyNow: "why this why now",
    priorKnowledgeRequirements: ["prior", "knowledge", "requirements"],
    containsGeorestrictedLessons: false,
    containsLoginRequiredLessons: false,
    ...partial,
  };
};

export default teachersUnitOverviewFixture;
