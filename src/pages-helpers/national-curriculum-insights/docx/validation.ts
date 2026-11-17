import { NationalCurriculumInsightsDownloadUnavailableError } from "../downloadLayout";

import {
  nationalCurriculumInsightsModuleSchema,
  flattenNationalCurriculumInsightsModules,
  type NationalCurriculumInsightsModule,
  type NationalCurriculumInsightsPage,
} from "@/common-lib/cms-types/nationalCurriculumInsights";

type Overview = Extract<
  NationalCurriculumInsightsModule,
  { __typename: "NationalCurriculumInsightsOverviewSection" }
>;

const hasReadableText = (blocks: unknown) =>
  Array.isArray(blocks) &&
  blocks.some(
    (block) =>
      (!block?._type || block._type === "block") &&
      Array.isArray(block?.children) &&
      block.children.some(
        (child: { text?: unknown } | null) =>
          typeof child?.text === "string" && child.text.trim(),
      ),
  );

export const getInsightsDocxPhaseHeadlines = (
  page: NationalCurriculumInsightsPage,
) => {
  const overviews = page.modules.filter(
    (module): module is Overview =>
      module.__typename === "NationalCurriculumInsightsOverviewSection",
  );
  const overview = overviews[0];
  if (
    overviews.length !== 1 ||
    !nationalCurriculumInsightsModuleSchema.safeParse(overview).success ||
    !overview?.heading.trim() ||
    !hasReadableText(overview.bodyPortableText)
  ) {
    throw new NationalCurriculumInsightsDownloadUnavailableError(
      "The phase headlines are not available yet.",
    );
  }
  return overview;
};

export const isClosingModule = (module: NationalCurriculumInsightsModule) =>
  module.__typename === "NationalCurriculumInsightsConfidenceSection" ||
  module.__typename === "NationalCurriculumInsightsFaqSection";

export const selectInsightsDocxClosingModules = ({
  page,
  stages,
  sharedModules,
}: {
  page: NationalCurriculumInsightsPage;
  stages: NationalCurriculumInsightsPage["keyStages"];
  sharedModules: NationalCurriculumInsightsModule[];
}) => {
  const closing = new Map<string, NationalCurriculumInsightsModule>();
  for (const section of flattenNationalCurriculumInsightsModules([
    ...page.modules,
    ...stages.flatMap(({ page: stagePage }) => stagePage.modules),
    ...sharedModules,
  ])) {
    if (isClosingModule(section) && !closing.has(section.__typename)) {
      closing.set(section.__typename, section);
    }
  }
  return [...closing.values()];
};

const requiredSectionTypes = [
  "NationalCurriculumInsightsOverviewSection",
  "NationalCurriculumInsightsChangesSection",
  "NationalCurriculumInsightsUnchangedSection",
  "NationalCurriculumInsightsPreparationSection",
];

const isCompleteFullInsight = (
  pageModules: NationalCurriculumInsightsModule[],
) => {
  const modules = flattenNationalCurriculumInsightsModules(pageModules);
  const uniqueSections = requiredSectionTypes.every(
    (type) =>
      modules.filter((module) => module.__typename === type).length === 1,
  );
  const checklists = modules.filter(
    (module) =>
      module.__typename === "NationalCurriculumInsightsChecklistSection",
  );
  const completeChecklists =
    checklists.length === 2 &&
    ["teacher", "schoolLeader"].every(
      (audience) =>
        checklists.filter((module) => module.audience === audience).length ===
        1,
    );
  const requiredModules = modules.filter(
    (module) =>
      requiredSectionTypes.includes(module.__typename) ||
      module.__typename === "NationalCurriculumInsightsChecklistSection",
  );
  const completeModules = requiredModules.every(
    (module) =>
      nationalCurriculumInsightsModuleSchema.safeParse(module).success,
  );
  const readableHeadlines =
    completeModules &&
    modules.some(
      (module) =>
        module.__typename === "NationalCurriculumInsightsOverviewSection" &&
        module.heading.trim() &&
        hasReadableText(module.bodyPortableText),
    );
  return (
    uniqueSections && completeChecklists && completeModules && readableHeadlines
  );
};

const isCompleteClosingModule = (module: NationalCurriculumInsightsModule) => {
  if (!nationalCurriculumInsightsModuleSchema.safeParse(module).success)
    return false;
  if (module.__typename !== "NationalCurriculumInsightsFaqSection") return true;
  return (
    module.heading.trim() &&
    module.items.length > 0 &&
    module.items.every(
      (item) =>
        item.question.trim() && hasReadableText(item.answerPortableText),
    )
  );
};

export const validateInsightsDocxContent = (input: {
  page: NationalCurriculumInsightsPage;
  stages: NationalCurriculumInsightsPage["keyStages"];
  sharedModules: NationalCurriculumInsightsModule[];
}) => {
  getInsightsDocxPhaseHeadlines(input.page);
  const fullPages = input.stages.length
    ? input.stages.map(({ page }) => page)
    : [input.page];
  if (fullPages.some((page) => !isCompleteFullInsight(page.modules))) {
    throw new NationalCurriculumInsightsDownloadUnavailableError(
      "Some required guidance is incomplete. Please try again later.",
    );
  }
  const closing = selectInsightsDocxClosingModules(input);
  if (closing.length !== 2 || !closing.every(isCompleteClosingModule)) {
    throw new NationalCurriculumInsightsDownloadUnavailableError(
      "Shared guidance is not available yet.",
    );
  }
};
