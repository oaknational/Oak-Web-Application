import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakFlex,
  OakBox,
  OakMaxWidth,
} from "@oaknational/oak-components";

import ImageContainer from "@/components/GenericPagesComponents/ImageContainer";
import SearchForm from "@/components/SharedComponents/SearchForm";
import useSearch from "@/context/Search/useSearch";
import TeachersTabResourceSelectorCard from "@/components/GenericPagesComponents/TeachersTabResourceSelectorCard";
import { KeyStageKeypadProps } from "@/components/SharedComponents/KeyStageKeypad/KeyStageKeypad";
import KeyStageKeypad from "@/components/SharedComponents/KeyStageKeypad";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";

type TeacherTabProps = {
  keyStages: KeyStageKeypadProps["keyStages"];
};
const TeachersTab: FC<TeacherTabProps> = ({ keyStages }) => {
  const { track } = useAnalytics();
  const { setSearchTerm } = useSearch({});
  return (
    <OakFlex $background={"mint"} $pv="spacing-24" $overflow={"hidden"}>
      <OakMaxWidth $ph={["spacing-16"]}>
        <OakGrid $cg={"spacing-16"}>
          <OakGridArea $colSpan={[12, 6]}>
            <OakFlex
              $flexDirection={"column"}
              $maxWidth={["spacing-640"]}
              $pt={"spacing-32"}
              $alignItems={"flex-start"}
              $gap={"spacing-24"}
              $flexGrow={0}
              $flexShrink={1}
              $flexBasis={"auto"}
            >
              <OakHeading $font={"heading-7"} tag={"h1"} $color={"grey70"}>
                Teachers
              </OakHeading>
              <OakHeading $font={"heading-3"} tag={"h2"}>
                Powerful planning tools for every teacher and school
              </OakHeading>
              <OakTypography $font={"body-1"}>
                From curriculum planning to classroom teaching, Oak saves time
                at every step.
              </OakTypography>
              <OakGrid $mt="spacing-16">
                <OakGridArea $colSpan={[12, 12, 11]}>
                  <SearchForm
                    searchContext="homepage"
                    placeholderText="Search by keyword or topic"
                    searchTerm=""
                    handleSubmit={(value) => {
                      setSearchTerm(value);
                    }}
                    analyticsSearchSource={"homepage search box"}
                  />
                </OakGridArea>
              </OakGrid>
              <OakBox $pv="spacing-32" $width={"100%"}>
                <KeyStageKeypad
                  keyStages={keyStages}
                  title="View subjects by key stage"
                  titleTag="h3"
                  trackingOnClick={(
                    filterValue: string,
                    activeFilters: Record<string, string[]>,
                  ) =>
                    track.browseRefinedAccessed({
                      platform: "owa",
                      product: "teacher lesson resources",
                      engagementIntent: "refine",
                      componentType: "keystage_keypad_button",
                      eventVersion: "2.0.0",
                      analyticsUseCase: "Teacher",
                      filterType: "Key stage filter",
                      filterValue,
                      activeFilters,
                    })
                  }
                />
              </OakBox>
            </OakFlex>
          </OakGridArea>
          <OakGridArea $colSpan={[12, 6]} $alignItems={"flex-end"}>
            <ImageContainer
              imageSlug={"hero-pupils"}
              width={518}
              height={313}
              sizes={getSizes([100, 518])}
            >
              <TeachersTabResourceSelectorCard
                icon={"worksheet"}
                title="Worksheets"
                angle={-4}
                $bottom={30}
                $left={166}
                $display={["none", "none", "flex"]}
              />
              <TeachersTabResourceSelectorCard
                icon={"slide-deck"}
                title="Slide decks"
                angle={2}
                $bottom={110}
                $left={-72}
                $display={["none", "none", "flex"]}
              />
              <TeachersTabResourceSelectorCard
                icon={"quiz"}
                title="Quizzes"
                angle={4}
                $bottom={60}
                $right={-54}
                $display={["none", "none", "flex"]}
              />
            </ImageContainer>
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </OakFlex>
  );
};

export default TeachersTab;
