import { FC } from "react";

import { Breadcrumb } from "../Breadcrumbs";
import { HeaderWrapper } from "../HeaderLesson/HeaderWrapper";
import Flex from "../Flex";
import Box from "../Box";
import { Heading, Span } from "../Typography";
import SubjectIconBrushBorders from "../SubjectIconBrushBorders";
import CurriculumDownloadButton from "../CurriculumDownloadButtons/CurriculumDownloadButton";

import { OakColorName } from "@/styles/theme";

/**
 * This is a header for the lesson overview page.
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
  lessonDescription?: string;
  lessonIsNew?: boolean;
  title: string;
  programmeFactor: string;
};

const HeaderListing: FC<HeaderListingProps> = (props) => {
  const {
    subjectSlug,
    title,
    programmeFactor,
    keyStageSlug,
    keyStageTitle,
    subjectTitle,
    lessonIsNew,
    subjectIconBackgroundColor,
    breadcrumbs,
    background,
    tierSlug,
  } = props;

  return (
    <HeaderWrapper breadcrumbs={breadcrumbs} background={background}>
      <Flex $flexDirection={"column"}>
        <Flex>
          <Box $height={[80, 140]} $width={[80, 140]} $mr={[16, 32]}>
            <SubjectIconBrushBorders
              $pa={8}
              subjectSlug={subjectSlug}
              height={15}
              width={20}
              $ma={"auto"}
              lessonIsNew={lessonIsNew}
              color={subjectIconBackgroundColor}
            />
          </Box>
          <Flex $flexDirection={"column"}>
            <Span $mb={8} $color={"oakGrey4"} $font={"heading-light-7"}>
              {programmeFactor}
            </Span>
            <Heading $mb={24} tag={"h1"} $font={["heading-5", "heading-3"]}>
              {title}
            </Heading>
            <CurriculumDownloadButton
              keyStageSlug={keyStageSlug}
              keyStageTitle={keyStageTitle}
              subjectSlug={subjectSlug}
              subjectTitle={subjectTitle}
              tier={tierSlug}
            />
          </Flex>
        </Flex>
      </Flex>
    </HeaderWrapper>
  );
};

export default HeaderListing;
