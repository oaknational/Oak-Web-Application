import {
  OakFlex,
  OakBox,
  OakTertiaryInvertedButton,
} from "@oaknational/oak-components";

import {
  BaseHeaderNavFooterProps,
  PrevNextButtons,
} from "@/components/TeacherComponents/HeaderNavFooter/HeaderNavFooterShared";

export type LessonHeaderNavFooterProps = BaseHeaderNavFooterProps & {
  downloadButton: React.ReactElement;
};

export const LessonHeaderNavFooter = (props: LessonHeaderNavFooterProps) => {
  return (
    <OakFlex
      $background={`bg-decorative${props.backgroundColorLevel}-subdued`}
      $width={"100%"}
      $pv={"spacing-24"}
      $ph={["spacing-20", "spacing-40"]}
      $flexDirection={["column", "row"]}
      $gap={"spacing-24"}
      $justifyContent="center"
    >
      <OakFlex
        $justifyContent={"space-between"}
        $width={"100%"}
        $gap={"spacing-16"}
        $maxWidth="spacing-1280"
      >
        <OakFlex as="nav" $gap={"spacing-32"} $alignItems={"center"}>
          <OakTertiaryInvertedButton
            iconName="list"
            element="a"
            href={props.viewHref}
          >
            View unit
          </OakTertiaryInvertedButton>
          <OakBox
            $bl={"border-solid-m"}
            $display={["none", "flex"]}
            $height={"spacing-24"}
            $borderColor={`border-decorative${props.backgroundColorLevel}`}
          />
          <PrevNextButtons
            type="lesson"
            $display={["none", "flex"]}
            {...props}
          />
        </OakFlex>
        {props.downloadButton}
      </OakFlex>
      <OakBox
        $display={["block", "none"]}
        $bt={"border-solid-m"}
        $borderColor={`border-decorative${props.backgroundColorLevel}`}
        $width={"100%"}
      />
      <PrevNextButtons type="lesson" $display={["flex", "none"]} {...props} />
    </OakFlex>
  );
};
