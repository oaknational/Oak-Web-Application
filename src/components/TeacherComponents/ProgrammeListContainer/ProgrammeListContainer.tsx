import { FC } from "react";
import {
  OakGridArea,
  OakGridAreaProps,
  OakColorToken,
} from "@oaknational/oak-components";

export type ProgrammeListContainer = {
  children?: React.ReactNode;
  numberOfProgrammes?: number;
  $background?: OakColorToken;
} & OakGridAreaProps;

const ProgrammeListContainer: FC<ProgrammeListContainer> = (props) => {
  const {
    children,
    numberOfProgrammes,
    $background = "lavender30",
    ...gridAreaProps
  } = props;
  return (
    <OakGridArea
      $background={$background}
      $pa={"spacing-16"}
      $borderRadius={"border-radius-s"}
      $width="100%"
      {...gridAreaProps}
    >
      {children}
    </OakGridArea>
  );
};

export default ProgrammeListContainer;
