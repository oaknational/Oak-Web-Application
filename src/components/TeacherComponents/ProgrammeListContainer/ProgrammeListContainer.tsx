import { FC } from "react";

import {
  GridArea,
  GridAreaProps,
} from "@/components/SharedComponents/Grid.deprecated";
import { OakColorName } from "@/styles/theme";

export type ProgrammeListContainer = {
  children?: React.ReactNode;
  numberOfProgrammes?: number;
  $background?: OakColorName;
} & GridAreaProps;

const ProgrammeListContainer: FC<ProgrammeListContainer> = (props) => {
  const {
    children,
    numberOfProgrammes,
    $background = "lavender30",
    ...gridAreaProps
  } = props;
  return (
    <GridArea
      $background={$background}
      $pa={16}
      $borderRadius={4}
      {...gridAreaProps}
    >
      {children}
    </GridArea>
  );
};

export default ProgrammeListContainer;
