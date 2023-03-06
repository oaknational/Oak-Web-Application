import { FC } from "react";

import { OakColorName } from "../../styles/theme/types";
import { getSizes } from "../CMSImage/getSizes";
import Flex from "../Flex";
import SubjectIcon from "../SubjectIcon";

export type IconMobileProps = {
  subjectSlug: string;
  background: OakColorName;
};

const IconMobileContainer: FC<IconMobileProps> = (props) => {
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
        sizes={getSizes([72, 92])}
        $height="auto"
        $maxHeight={[72, 92]}
        $maxWidth={[72, 92]}
        $ma={"auto"}
      />
    </Flex>
  );
};

export default IconMobileContainer;
