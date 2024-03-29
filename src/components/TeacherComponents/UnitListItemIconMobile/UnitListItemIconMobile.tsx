import { FC } from "react";

import SubjectIcon from "@/components/SharedComponents/SubjectIcon";
import { OakColorName } from "@/styles/theme/types";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export type UnitListItemIconMobileProps = {
  subjectSlug: string;
  background: OakColorName;
};

const UnitListItemIconMobile: FC<UnitListItemIconMobileProps> = (props) => {
  const { background, subjectSlug } = props;

  return (
    <Flex
      $justifyContent={"center"}
      $display={["flex", "none"]}
      $alignItems={"center"}
      $height={"100%"}
      $minHeight={72}
      $minWidth={72}
      $background={background}
      $position={"relative"}
      $ml={"auto"}
    >
      <SubjectIcon
        subjectSlug={subjectSlug}
        height={96}
        width={96}
        $height="auto"
        $maxHeight={72}
        $maxWidth={72}
        $ma={"auto"}
      />
    </Flex>
  );
};

export default UnitListItemIconMobile;
