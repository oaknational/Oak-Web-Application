import { FC } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import OwaLink from "@/components/SharedComponents/OwaLink";
import Card from "@/components/SharedComponents/Card";
import useClickableCard from "@/hooks/useClickableCard";
import { SpecialistProgramme } from "@/node-lib/curriculum-api-2023/queries/specialistProgrammeListing/specialistProgrammeListing.schema";
import { P } from "@/components/SharedComponents/Typography";

export type SpecialistProgrammeListItemProps = {
  programme: SpecialistProgramme;
  onClick: (props: SpecialistProgramme) => void;
};

const SpecialistProgrammeListItem: FC<SpecialistProgrammeListItemProps> = (
  props,
) => {
  const { programme, onClick } = props;
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  return (
    <Card
      $overflow={"hidden"}
      {...containerProps}
      $pa={0}
      data-testid={"programme-list-item"}
      $background={isHovered ? "grey20" : "white"}
      $transition={"all 0.4s ease-out"}
      $width={["100%", "100%", 400]}
      $flexGrow={0}
    >
      <OakFlex $pa="inner-padding-m">
        <OwaLink
          page={"specialist-unit-index"}
          {...primaryTargetProps}
          {...props.programme}
          onClick={() => onClick(programme)}
        >
          <OakHeading
            $font={"heading-7"}
            tag="h3"
            ariaLabel={props.programme.developmentStageTitle}
          >
            {props.programme.developmentStageTitle}
          </OakHeading>
          <OakFlex $gap="all-spacing-1">
            <P>{props.programme.unitCount} units</P>
            <P>•</P>
            <P>{props.programme.lessonCount} lessons</P>
          </OakFlex>
        </OwaLink>
      </OakFlex>

      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default SpecialistProgrammeListItem;
