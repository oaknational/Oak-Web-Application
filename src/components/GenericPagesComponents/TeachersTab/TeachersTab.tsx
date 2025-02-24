"use client";

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
// import SearchForm from "@/components/SharedComponents/SearchForm";
// import useSearch from "@/context/Search/useSearch";
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
  // const { setSearchTerm } = useSearch({});
  return (
    <OakFlex $background={"mint"} $pv="inner-padding-xl" $overflow={"hidden"}>
      <OakMaxWidth $ph={["inner-padding-m"]}>
        <OakGrid $cg={"all-spacing-4"}>
          <OakGridArea $colSpan={[12, 6]}>
            <OakFlex
              $flexDirection={"column"}
              $maxWidth={["all-spacing-22"]}
              $pt={"inner-padding-xl2"}
              $alignItems={"flex-start"}
              $gap={"all-spacing-6"}
              $flexGrow={0}
              $flexShrink={1}
              $flexBasis={"auto"}
            >
              <OakHeading $font={"heading-7"} tag={"h1"} $color={"grey70"}>
                Teachers
              </OakHeading>
              <OakHeading $font={"heading-3"} tag={"h2"}>
                Time-saving teaching resources
              </OakHeading>
              <OakTypography $font={"body-1"}>
                Get a head-start on your lesson planning using quality-checked
                resources you can download and adapt for free.
              </OakTypography>
              <OakGrid $mt="space-between-s">
                <OakGridArea $colSpan={[12, 12, 11]}>
                  {/* <SearchForm
                    searchContext="homepage"
                    placeholderText="Search by keyword or topic"
                    searchTerm=""
                    handleSubmit={(value) => {
                      setSearchTerm(value);
                    }}
                    analyticsSearchSource={"homepage search box"}
                  /> */}
                </OakGridArea>
              </OakGrid>
              <OakBox $pv="inner-padding-xl2" $width={"100%"}>
                <KeyStageKeypad
                  keyStages={keyStages}
                  title="View subjects by key stage"
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
