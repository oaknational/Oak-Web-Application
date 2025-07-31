import { ComponentProps, FC } from "react";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakIcon,
  OakBox,
  OakTertiaryButton,
} from "@oaknational/oak-components";

type SuccessMessageProps = {
  title: string;
  message: string;
  buttonProps: ComponentProps<typeof OakTertiaryButton> & { label: string };
};
const SuccessMessage: FC<SuccessMessageProps> = ({
  title,
  message,
  buttonProps,
}) => {
  const { label: buttonLabel, ...buttonPropsWithoutLabel } = buttonProps;
  return (
    <OakBox
      $maxWidth="all-spacing-24"
      $mh={"auto"}
      $ph="inner-padding-l"
      $width={"100%"}
      $pb={["inner-padding-xl2", "inner-padding-xl4"]}
    >
      <OakFlex
        $width={"100%"}
        $flexDirection={["column", "row", "row"]}
        $alignItems={["start", "center"]}
        $gap={["space-between-m", "space-between-m", "all-spacing-16"]}
      >
        <OakFlex
          $flexDirection={"column"}
          $alignItems={"center"}
          $justifyContent={"center"}
          $flexShrink={1}
        >
          <OakBox
            $height={["all-spacing-16", "all-spacing-19", "all-spacing-19"]}
            $width={["all-spacing-17", "all-spacing-19", "all-spacing-20"]}
          >
            <OakIcon
              iconName="tick-mark-happiness"
              $width={"100%"}
              $height={"100%"}
            />
          </OakBox>
        </OakFlex>
        <OakFlex
          $flexDirection={"column"}
          $alignItems={"start"}
          $gap={"space-between-m"}
          $flexShrink={1}
          $flexGrow={1}
        >
          <OakBox>
            <OakTertiaryButton
              {...buttonPropsWithoutLabel}
              iconName="chevron-left"
              data-testid="back-to-downloads-link"
            >
              {buttonLabel}
            </OakTertiaryButton>
          </OakBox>
          <OakHeading tag="h2" $font={["heading-4"]}>
            {title}
          </OakHeading>
          <OakP $font={["body-1"]}>{message}</OakP>
        </OakFlex>
      </OakFlex>
    </OakBox>
  );
};

export default SuccessMessage;
