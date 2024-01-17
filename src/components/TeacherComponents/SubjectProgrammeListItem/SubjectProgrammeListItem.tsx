import { FC } from "react";

import { SubjectProgrammeListProps } from "../SubjectProgrammeList/SubjectProgrammeList";

import Flex from "@/components/SharedComponents/Flex";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import { Heading } from "@/components/SharedComponents/Typography";
import OwaLink from "@/components/SharedComponents/OwaLink";
import Card from "@/components/SharedComponents/Card";
import useClickableCard from "@/hooks/useClickableCard";
import {
  SpecialistUnitListingLinkProps,
  UnitListingLinkProps,
} from "@/common-lib/urls";
import { SpecialistProgramme } from "@/node-lib/curriculum-api-2023/queries/specialistProgrammeListing/specialistProgrammeListing.schema";

export type SubjectProgrammeListItemProps = {
  programme:
    | SubjectProgrammeListProps["programmes"][number]
    | SpecialistProgramme;
  onClick: (
    props:
      | SubjectProgrammeListProps["programmes"][number]
      | SpecialistProgramme,
  ) => void;
};

const SubjectProgrammeListItem: FC<SubjectProgrammeListItemProps> = (props) => {
  const { programme, onClick } = props;
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  const isSpecialist = "developmentalStageTitle" in programme;

  const heading = isSpecialist
    ? programme.developmentalStageTitle
    : programme.tierTitle ?? programme.examBoardTitle;

  const ariaLabel = isSpecialist
    ? programme.developmentalStageTitle
    : `${programme.tierTitle ? programme.tierTitle : ""} ${
        programme.examBoardTitle ? programme.examBoardTitle : ""
      }`;

  const linkProps: UnitListingLinkProps | SpecialistUnitListingLinkProps =
    isSpecialist
      ? { page: "specialist-unit-index", ...programme }
      : { page: "unit-index", ...programme };

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
          {...primaryTargetProps}
          {...linkProps}
          onClick={() => onClick(programme)}
        >
          <Heading $font={"heading-7"} tag="h3" ariaLabel={ariaLabel}>
            {heading}
          </Heading>
        </OwaLink>
      </Flex>

      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default SubjectProgrammeListItem;
