import { FC } from "react";

import Flex from "@/components/SharedComponents/Flex";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import { Heading } from "@/components/SharedComponents/Typography";
import OwaLink from "@/components/SharedComponents/OwaLink";
import Card from "@/components/SharedComponents/Card";
import useClickableCard from "@/hooks/useClickableCard";
import { SpecialistProgramme } from "@/node-lib/curriculum-api-2023/queries/specialistProgrammeListing/specialistProgrammeListing.schema";

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
    >
      <Flex $pa={16}>
        <OwaLink
          page={"specialist-unit-index"}
          {...primaryTargetProps}
          {...props.programme}
          onClick={() => onClick(programme)}
        >
          <Heading
            $font={"heading-7"}
            tag="h3"
            ariaLabel={props.programme.developmentalStageTitle}
          >
            {props.programme.developmentalStageTitle}
          </Heading>
        </OwaLink>
      </Flex>

      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default SpecialistProgrammeListItem;
