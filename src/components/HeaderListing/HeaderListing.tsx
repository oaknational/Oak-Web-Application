import { FC } from "react";

import { Breadcrumb } from "../Breadcrumbs";
import { HeaderWrapper } from "../HeaderLesson/HeaderWrapper";
import Flex from "../Flex";
import Box from "../Box";
import { Heading, Span } from "../Typography";
import SubjectIconBrushBorders from "../SubjectIconBrushBorders";
import CurriculumDownloadButton from "../CurriculumDownloadButtons/CurriculumDownloadButton";

import HeaderMetadata from "./HeaderMetadata";

import { OakColorName } from "@/styles/theme";

/**
 * This is a header for the listing pages (lesson, unit and programme).
 *
 */

export type HeaderListingProps = {
  breadcrumbs: Breadcrumb[];
  background: OakColorName;
  subjectTitle: string;
  subjectSlug: string;
  subjectIconBackgroundColor: OakColorName;
  year?: string;
  keyStageSlug: string;
  keyStageTitle: string;
  tierSlug?: string | null;
  examBoardTitle?: string | null;
  tierTitle?: string | null;
  yearTitle?: string | null;
  lessonDescription?: string;
  isNew?: boolean;
  title: string;
  programmeFactor: string;
  hasCurriculumDownload?: boolean;
};

const HeaderListing: FC<HeaderListingProps> = (props) => {
  const {
    subjectSlug,
    title,
    keyStageSlug,
    keyStageTitle,
    subjectTitle,
    isNew,
    subjectIconBackgroundColor,
    breadcrumbs,
    background,
    tierSlug,
    hasCurriculumDownload = true,
    examBoardTitle,
    tierTitle,
    yearTitle,
  } = props;

  return (
    <HeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <Flex $mb={[12, 0]} $flexDirection={"column"}>
        <Flex>
          <Box $height={[80, 140]} $width={[80, 140]} $mr={[16, 32]}>
            <SubjectIconBrushBorders
              $pa={8}
              subjectSlug={subjectSlug}
              height={15}
              width={20}
              $ma={"auto"}
              isNew={isNew}
              color={subjectIconBackgroundColor}
            />
          </Box>
          <Flex $flexDirection={"column"}>
            <Span $mb={8} $color={"oakGrey4"} $font={"heading-light-7"}>
              <HeaderMetadata
                examBoardTitle={examBoardTitle}
                yearTitle={yearTitle}
                tierTitle={tierTitle}
              />
            </Span>
            <Heading $mb={24} tag={"h1"} $font={["heading-5", "heading-3"]}>
              {title}
            </Heading>
            <Flex $display={["none", "flex"]}>
              {hasCurriculumDownload && (
                <CurriculumDownloadButton
                  keyStageSlug={keyStageSlug}
                  keyStageTitle={keyStageTitle}
                  subjectSlug={subjectSlug}
                  subjectTitle={subjectTitle}
                  tier={tierSlug}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex $background={background} $display={["inline", "none"]}>
        {hasCurriculumDownload && (
          <CurriculumDownloadButton
            keyStageSlug={keyStageSlug}
            keyStageTitle={keyStageTitle}
            subjectSlug={subjectSlug}
            subjectTitle={subjectTitle}
            tier={tierSlug}
          />
        )}
      </Flex>
    </HeaderWrapper>
  );
};

export default HeaderListing;
