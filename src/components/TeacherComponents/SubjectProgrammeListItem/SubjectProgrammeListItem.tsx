import { FC } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import OwaLink from "@/components/SharedComponents/OwaLink";
import Card from "@/components/SharedComponents/Card";
import useClickableCard from "@/hooks/useClickableCard";
import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

export type SubjectProgrammeListItemProps = {
  programme: ProgrammeListingPageData["programmes"][number];
  onClick: (props: ProgrammeListingPageData["programmes"][number]) => void;
};

const SubjectProgrammeListItem: FC<SubjectProgrammeListItemProps> = (props) => {
  const { programme, onClick } = props;
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  const heading = programme.tierTitle ?? programme.examBoardTitle;

  const ariaLabel = `${programme.tierTitle ? programme.tierTitle : ""} ${
    programme.examBoardTitle ? programme.examBoardTitle : ""
  }`;

  return (
    <Card
      $overflow={"hidden"}
      {...containerProps}
      $pa={0}
      data-testid={"programme-list-item"}
      $background={isHovered ? "grey20" : "white"}
      $transition={"all 0.4s ease-out"}
    >
      <OakFlex $pa="inner-padding-m">
        <OwaLink
          page="unit-index"
          {...primaryTargetProps}
          {...props.programme}
          data-testid="programme-list-item-link"
          onClick={() => onClick(programme)}
        >
          <OakHeading $font={"heading-7"} tag="h3" ariaLabel={ariaLabel}>
            {heading}
          </OakHeading>
        </OwaLink>
      </OakFlex>

      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default SubjectProgrammeListItem;
