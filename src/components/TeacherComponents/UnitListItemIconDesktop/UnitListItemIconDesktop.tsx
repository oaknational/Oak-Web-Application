import { FC } from "react";

import SubjectIcon from "@/components/SharedComponents/SubjectIcon";
import { OakColorName } from "@/styles/theme/types";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export type UnitListItemIconDesktopProps = {
  title: string;
  subjectSlug: string;
  background: OakColorName;
};

const UnitListItemIconDesktop: FC<UnitListItemIconDesktopProps> = (props) => {
  const { background, subjectSlug } = props;

  return (
    <Flex
      $justifyContent={"center"}
      $display={["none", "flex"]}
      $alignItems={"center"}
      $minHeight={110}
      $minWidth={130}
      $height={"100%"}
      $background={background}
      $position={"relative"}
      $dropShadow={"subjectCard"}
      $transition={"all 0.4s ease-out"}
      data-testid="list-item-icon"
    >
      <SubjectIcon
        subjectSlug={subjectSlug}
        height={96}
        width={96}
        $maxHeight={96}
        $maxWidth={96}
        $ma={"auto"}
      />
    </Flex>
  );
};

export default UnitListItemIconDesktop;
