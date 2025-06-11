import {
  OakIcon,
  OakIconName,
  OakColorToken,
  OakFlex,
  OakP,
  OakAllSpacingToken,
  OakBox,
} from "@oaknational/oak-components";

export interface CurricInfoCardProps {
  text: string;
  iconName?: OakIconName;
  background: OakColorToken;
  iconHeight: OakAllSpacingToken;
  iconWidth: OakAllSpacingToken;
}

export default function CurricInfoCard({
  text,
  iconName = "books",
  iconHeight,
  iconWidth,
  background,
}: CurricInfoCardProps) {
  return (
    <OakBox $maxWidth={"all-spacing-20"}>
      <OakFlex
        $flexGrow={1}
        $flexBasis={0}
        $minWidth="all-spacing-17"
        $borderRadius={"border-radius-m"}
        $background={background}
        $minHeight={"all-spacing-19"}
        $borderColor={"mint110"}
        $ba={"border-solid-m"}
        $flexDirection="column"
        $alignItems={"flex-start"}
        $pa={"inner-padding-xl"}
      >
        <OakIcon
          iconName={iconName}
          alt={iconName}
          $mb={"space-between-s"}
          iconHeight={iconHeight}
          iconWidth={iconWidth}
        />
        <OakP $font="heading-light-6" $textAlign={"left"}>
          {text}
        </OakP>
      </OakFlex>
    </OakBox>
  );
}
