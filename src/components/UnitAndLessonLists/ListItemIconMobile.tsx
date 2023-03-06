import { FC } from "react";

import { OakColorName } from "../../styles/theme/types";
import Flex from "../Flex";
import SubjectIcon from "../SubjectIcon";

export type ListItemIconMobileProps = {
  subjectSlug: string;
  background: OakColorName;
};

const ListItemIconMobile: FC<ListItemIconMobileProps> = (props) => {
  const { background, subjectSlug } = props;

  return (
    <Flex
      $justifyContent={"center"}
      $display={["flex", "none"]}
      $alignItems={"center"}
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

export default ListItemIconMobile;
