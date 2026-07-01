import { DropdownFocusManager } from "./DropdownFocusManager";

import {
  PhaseSlug,
  PupilsSubNavData,
  TeachersSubNavData,
  topnavPhaseSchema,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { KeystageSlug } from "@/node-lib/curriculum-api-2023/shared.schema";

type DropdownFocusManagerHelperProps = {
  focusManager?: DropdownFocusManager<TeachersSubNavData | PupilsSubNavData>;
  slug: string;
};

/**
 * Helper functions to get valid IDs for buttons in the dropdown nav
 * based on the nav hierarchy
 */

export const getTopLevelNavButtonId = ({
  focusManager,
  slug,
}: DropdownFocusManagerHelperProps) => {
  return focusManager?.getIdFromPath([slug]);
};

export const getSecondLevelNavButton = ({
  focusManager,
  slug,
  topLevelSlug,
}: DropdownFocusManagerHelperProps & { topLevelSlug: string }) => {
  return focusManager?.getIdFromPath([topLevelSlug, slug]);
};

export const getKeystageButtonNodeId = ({
  focusManager,
  slug,
  phase,
}: DropdownFocusManagerHelperProps & { phase: PhaseSlug }) => {
  return focusManager?.getIdFromPath([phase, "keystages", slug]);
};

export const getSubjectButtonId = ({
  focusManager,
  slug,
  phase,
  identifyingSlug,
}: DropdownFocusManagerHelperProps & {
  phase: PhaseSlug;
  identifyingSlug: KeystageSlug | PhaseSlug;
}) => {
  const path = topnavPhaseSchema.safeParse(identifyingSlug).success
    ? [phase, identifyingSlug, slug]
    : [phase, "keystages", identifyingSlug, slug];
  return focusManager?.getIdFromPath(path);
};

export const getKs4OptionButtonId = ({
  focusManager,
  slug,
  phase,
  subjectSlug,
  identifyingSlug,
}: DropdownFocusManagerHelperProps & {
  phase: PhaseSlug;
  subjectSlug: string;
  identifyingSlug: KeystageSlug | PhaseSlug;
}) => {
  const path = topnavPhaseSchema.safeParse(identifyingSlug).success
    ? [phase, identifyingSlug, subjectSlug, slug]
    : [phase, "keystages", identifyingSlug, subjectSlug, slug];
  return focusManager?.getIdFromPath(path);
};
