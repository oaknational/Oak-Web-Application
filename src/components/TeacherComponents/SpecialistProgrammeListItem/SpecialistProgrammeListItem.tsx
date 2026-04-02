import { FC } from "react";
import {
  OakHeading,
  OakFlex,
  OakBulletList,
  OakSecondaryLink,
} from "@oaknational/oak-components";

import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import Card from "@/components/SharedComponents/Card";
import useClickableCard from "@/hooks/useClickableCard";
import { SpecialistProgramme } from "@/node-lib/curriculum-api-2023/queries/specialistProgrammeListing/specialistProgrammeListing.schema";
import { resolveOakHref } from "@/common-lib/urls";

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
      $pa={"spacing-0"}
      data-testid={"programme-list-item"}
      $background={isHovered ? "bg-neutral" : "bg-primary"}
      $transition={"standard-ease"}
      $width={["100%", "100%", "spacing-360"]}
      $flexGrow={0}
    >
      <OakFlex $pa="spacing-16">
        <OakSecondaryLink
          href={resolveOakHref({
            page: "specialist-unit-index",
            programmeSlug: props.programme.programmeSlug,
          })}
          {...primaryTargetProps}
          onClick={() => onClick(programme)}
        >
          <OakFlex $flexDirection="column" $gap={"spacing-4"}>
            <OakHeading
              $font={"heading-7"}
              tag="h3"
              ariaLabel={props.programme.developmentStageTitle}
            >
              {props.programme.developmentStageTitle}
            </OakHeading>
            <OakBulletList
              listItems={[
                `${props.programme.unitCount} units`,
                `${props.programme.lessonCount} lessons`,
              ]}
            />
          </OakFlex>
        </OakSecondaryLink>
      </OakFlex>
      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default SpecialistProgrammeListItem;
