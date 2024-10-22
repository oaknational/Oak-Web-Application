import { FC } from "react";
import { OakTypography } from "@oaknational/oak-components";

import { OakColorName } from "@/styles/theme";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly/";
import { Hr } from "@/components/SharedComponents/Typography";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import Box from "@/components/SharedComponents/Box";
import Tag from "@/components/SharedComponents/TagPromotional";

// Page types that will likely go in the banner and that do not require additional props
type SimplePageType =
  | "careers"
  | "classroom"
  | "contact"
  | "curriculum-landing-page"
  | "develop-your-curriculum"
  | "home"
  | "help"
  | "labs"
  | "lesson-planning"
  | "oak-curriculum"
  | "onboarding"
  | "onboarding-role-selection"
  | "onboarding-school-selection"
  | "onboarding-use-of-oak"
  | "our-teachers"
  | "support-your-team"
  | "teacher-hub";

type HomePageBannerProps = {
  background: OakColorName;
  newText: string;
  ctaText: string;
  page: SimplePageType;
};

const HomePageBanner: FC<HomePageBannerProps> = ({
  background,
  newText,
  ctaText,
  page,
}) => (
  <Box role="banner">
    <Flex
      $background={background}
      $justifyContent={["center"]}
      $alignItems={"center"}
      $pv={8}
      $ph={[8, 10]}
    >
      <Flex
        $alignItems={"center"}
        $flexWrap={"wrap"}
        $gap={[20, 44]}
        $justifyContent={"center"}
        $pv={0}
      >
        <Flex $alignItems={"center"} $gap={[0, 4]} $minWidth={["fit-content"]}>
          <Tag aria-hidden="true" size={"small"} />
          <OakTypography $font={["body-3", "body-2"]}>
            <ScreenReaderOnly>New</ScreenReaderOnly> {newText}
          </OakTypography>
        </Flex>
        <ButtonAsLink
          label={ctaText}
          variant={"buttonStyledAsLink"}
          page={page}
          $font={["body-3-bold", "body-2-bold"]}
          icon={"chevron-right"}
          $iconPosition={"trailing"}
          iconBackground="lemon"
          size={"medium"}
          $mh={0}
        />
      </Flex>
    </Flex>
    <Hr $color={"black"} $background={"lemon"} thickness={4} $mb={0} $mt={0} />
  </Box>
);

export default HomePageBanner;
