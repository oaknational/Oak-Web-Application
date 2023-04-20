import { ProgrammeLinkProps } from "../../../common-lib/urls";
import Flex from "../../Flex";
import CategoryFilterList from "../CategoryFilterList";
import useCategoryFilterList from "../CategoryFilterList/useCategoryFilterList";

export type LearningThemeSelectedTrackingProps = {
  keyStageSlug: string;
  keyStageTitle: string;
  subjectTitle: string;
  subjectSlug: string;
};

export type LearningTheme = {
  learningThemeSlug?: string;
  learningThemeTitle?: string;
};

export type LearningThemeFiltersProps = {
  labelledBy: string;
  selectedThemeSlug: string;
  learningThemes: LearningTheme[];
  linkProps: ProgrammeLinkProps;
  trackingProps: LearningThemeSelectedTrackingProps;
};
const LearningThemeFilters = ({
  labelledBy,
  learningThemes,
  selectedThemeSlug,
  linkProps,
  trackingProps,
}: LearningThemeFiltersProps) => {
  const listStateProps = useCategoryFilterList({
    selectedKey: selectedThemeSlug,
    getKey: (linkProps: ProgrammeLinkProps) => {
      if (linkProps.search?.["learning-theme"]) {
        return linkProps.search?.["learning-theme"];
      } else return "all";
    },
  });

  const learningThemesMapped = learningThemes
    .map((learningTheme) => {
      return {
        label: learningTheme?.learningThemeTitle,
        slug: learningTheme?.learningThemeSlug,
      };
    })
    .sort(
      (
        a: {
          label: string | undefined;
          slug: string | undefined;
        },
        b: {
          label: string | undefined;
          slug: string | undefined;
        }
      ) => {
        if (a?.slug === "no-theme") {
          return 0;
        } else if (b?.slug === "no-theme") {
          return -1;
        } else {
          return 0;
        }
      }
    );

  return (
    <Flex $flexDirection={"column"}>
      <CategoryFilterList
        {...listStateProps}
        labelledBy={labelledBy}
        categories={[
          {
            label: "All in suggested order",
            linkProps: {
              ...linkProps,
              search: { ...linkProps.search, ["learning-theme"]: undefined },
            },
          },
          ...learningThemesMapped.map(({ label, slug }) => ({
            label: label ? label : "",
            linkProps: {
              ...linkProps,
              search: { ...linkProps.search, ["learning-theme"]: slug },
            },
          })),
        ]}
        trackingProps={trackingProps}
      />
    </Flex>
  );
};

export default LearningThemeFilters;
