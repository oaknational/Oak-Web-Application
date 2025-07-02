import { FC } from "react";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakIcon,
  OakBox,
} from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import Button, { ButtonProps } from "@/components/SharedComponents/Button";

type SuccessMessageProps = {
  title: string;
  message: string;
  buttonProps: Exclude<ButtonProps, "varient" | "icon" | "size">;
};
const SuccessMessage: FC<SuccessMessageProps> = ({
  title,
  message,
  buttonProps,
}) => {
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
          <Box $height={[140, 240, 270]} $width={[166, 240, 320]}>
            <OakIcon
              iconName="tick-mark-happiness"
              $width={"100%"}
              $height={"100%"}
            />
          </Box>
        </OakFlex>
        <OakFlex
          $flexDirection={"column"}
          $alignItems={"start"}
          $gap={"space-between-m"}
          $flexShrink={1}
          $flexGrow={1}
        >
          <OakP>
            <Button
              {...buttonProps}
              variant={"buttonStyledAsLink"}
              icon="chevron-left"
              data-testid="back-to-downloads-link"
              size="small"
            />
          </OakP>
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
