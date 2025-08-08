import { FC } from "react";
import { OakColorToken, OakFlex } from "@oaknational/oak-components";

import OutlineHeading from "@/components/SharedComponents/OutlineHeading/OutlineHeading";

export type ListItemIndexDesktopProps = {
  index: number;
  background: OakColorToken;
  disabled?: boolean | null;
};

const ListItemIndexDesktop: FC<ListItemIndexDesktopProps> = (props) => {
  const { background, index, disabled: expired } = props;

  return (
    <OakFlex
      $justifyContent={"center"}
      $display={["none", "flex"]}
      $alignItems={"center"}
      $minWidth={"all-spacing-13"}
      $height={"100%"}
      $background={background}
      $position={"relative"}
      $transition={"standard-ease"}
      data-testid="list-item-index-container"
    >
      <OutlineHeading
        tag={"div"}
        $fontSize={32}
        $lightShadow={expired}
        ariaHidden={true}
      >
        {index.toString()}
      </OutlineHeading>
    </OakFlex>
  );
};

export default ListItemIndexDesktop;
