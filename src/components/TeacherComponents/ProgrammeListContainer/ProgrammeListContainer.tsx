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
      $pa={"inner-padding-m"}
      $borderRadius={"border-radius-s"}
      {...gridAreaProps}
    >
      {children}
    </OakGridArea>
  );
};

export default ProgrammeListContainer;
