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
      $maxWidth="spacing-1280"
      $mh={"auto"}
      $ph="spacing-20"
      $width={"100%"}
      $pb={["spacing-32", "spacing-48"]}
    >
      <OakFlex
        $width={"100%"}
        $flexDirection={["column", "row", "row"]}
        $alignItems={["start", "center"]}
        $gap={["spacing-24", "spacing-24", "spacing-120"]}
      >
        <OakFlex
          $flexDirection={"column"}
          $alignItems={"center"}
          $justifyContent={"center"}
          $flexShrink={1}
        >
          <OakBox
            $height={["spacing-120", "spacing-240", "spacing-240"]}
            $width={["spacing-160", "spacing-240", "spacing-360"]}
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
          $gap={"spacing-24"}
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
