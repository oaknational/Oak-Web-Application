import { FC } from "react";
import { OakFlex, OakSpan } from "@oaknational/oak-components";

import ListItemIndexDesktop from "@/components/TeacherComponents/ListItemIndexDesktop";
import ListItemCard from "@/components/TeacherComponents/ListItemCard";
import ListItemIndexMobile from "@/components/TeacherComponents/ListItemIndexMobile";
import useClickableCard from "@/hooks/useClickableCard";

export type ComingSoonListItemProps = {
  index: number;
  firstItemRef?: React.RefObject<HTMLAnchorElement> | null;
};

const ComingSoonListItem: FC<ComingSoonListItemProps> = ({
  index,
  firstItemRef,
}) => {
  const { containerProps } = useClickableCard<HTMLAnchorElement>(firstItemRef);

  return (
    <ListItemCard
      title=""
      subjectSlug=""
      index={index}
      isHovered={false}
      background={"grey20"}
      expired={true}
      containerProps={containerProps}
    >
      <>
        <ListItemIndexDesktop
          index={index + 1}
          expired={true}
          background="grey30"
        />
        <ListItemIndexMobile
          index={index + 1}
          expired={true}
          background="grey30"
        />
      </>

      <OakFlex
        $flexDirection={"row"}
        $alignItems={"center"}
        $width={"100%"}
        $height={"100%"}
        $pl="inner-padding-xl"
      >
        <OakSpan
          $font={"heading-7"}
          $color={"grey60"}
          data-testid={"coming-soon"}
        >
          Coming Soon!
        </OakSpan>
      </OakFlex>
    </ListItemCard>
  );
};

export default ComingSoonListItem;
