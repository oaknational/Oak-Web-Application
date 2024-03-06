import {
  OakBox,
  OakFlex,
  OakHeading,
  OakPrimaryButton,
} from "@oaknational/oak-components";

export const PupilExpiredView = ({ lessonTitle }: { lessonTitle: string }) => {
  return (
    <OakFlex
      $height={"100vh"}
      $justifyContent={"center"}
      $alignItems={"center"}
      $background={"bg-decorative1-main"}
      $flexDirection={"column"}
    >
      <OakFlex
        $pa={["inner-padding-none", "inner-padding-xl"]}
        $justifyContent={"center"}
        $gap={["space-between-m"]}
        $alignItems={["center", "flex-start"]}
        $flexDirection={"column"}
        $background={"bg-decorative1-very-subdued"}
        $flexGrow={[1, 0]}
        $width={["100%", "auto"]}
        $borderRadius={[null, "border-radius-m"]}
        $borderColor={[null, "border-decorative1-stronger"]}
        $ba={["border-solid-none", "border-solid-m"]}
      >
        <OakFlex
          $flexDirection={"column"}
          $gap={["space-between-m"]}
          $alignItems={["center", "flex-start"]}
          $justifyContent={["center", "flex-start"]}
          $flexGrow={[1, 0]}
        >
          <OakHeading
            $textAlign={"center"}
            tag="h1"
            $font={["heading-5", "heading-4"]}
          >
            {lessonTitle}
          </OakHeading>
          <OakHeading
            $textAlign={"center"}
            tag="h2"
            $font={["body-2", "body-1"]}
          >
            Sorry, this lesson is no longer available
          </OakHeading>
        </OakFlex>
        <OakBox
          $width={["100%", "max-content"]}
          $pa={["inner-padding-l", "inner-padding-none"]}
        >
          <OakPrimaryButton
            width={["100%", "max-content"]}
            element="a"
            href="https://support.thenational.academy/lesson-unavailable"
            target="_blank"
          >
            Find out why
          </OakPrimaryButton>
        </OakBox>
      </OakFlex>
    </OakFlex>
  );
};
