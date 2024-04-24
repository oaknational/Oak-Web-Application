import { FC } from "react";
import { OakFlex, OakHeading, OakP } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import Button, { ButtonProps } from "@/components/SharedComponents/Button";
import Svg from "@/components/SharedComponents/Svg";

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
    <Box $maxWidth={1280} $mh={"auto"} $ph={18} $width={"100%"} $pb={[32, 48]}>
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
            <Svg name="tick-mark-happiness" />
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
    </Box>
  );
};

export default SuccessMessage;
