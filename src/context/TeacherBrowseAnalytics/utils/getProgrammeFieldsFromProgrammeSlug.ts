import {
  getExamboardTitleFromSlug,
  getKeyStageTitle,
  getTierTitleFromSlug,
} from "@/utils/curriculum/formatting";
import { getPathwayTitleFromSlug } from "@/utils/curriculum/pathways";
import { parseProgrammeSlug } from "@/utils/curriculum/slugs";

export const getProgrammeFieldsFromProgrammeSlug = (programmeSlug: string) => {
  const parsedProgrammeSlug = parseProgrammeSlug(programmeSlug);

  if (!parsedProgrammeSlug) {
    return null;
  }

  const { keystageSlug, tierSlug, pathwaySlug, examboardSlug } =
    parsedProgrammeSlug;

  if (!keystageSlug) {
    return null;
  }

  return {
    keyStageSlug: keystageSlug,
    tierSlug,
    pathwaySlug,
    examBoardSlug: examboardSlug,
    examBoard: getExamboardTitleFromSlug(examboardSlug),
    keyStageTitle: getKeyStageTitle(keystageSlug),
    tierName: getTierTitleFromSlug(tierSlug),
    pathway: getPathwayTitleFromSlug(pathwaySlug),
  };
};
