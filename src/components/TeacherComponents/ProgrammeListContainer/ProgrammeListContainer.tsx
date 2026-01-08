import { FC } from "react";
import {
  OakGridArea,
  OakGridAreaProps,
  OakUiRoleToken,
} from "@oaknational/oak-components";

export type ProgrammeListContainer = {
  children?: React.ReactNode;
  numberOfProgrammes?: number;
  $background?: OakUiRoleToken;
} & OakGridAreaProps;

const ProgrammeListContainer: FC<ProgrammeListContainer> = (props) => {
  const {
    children,
    numberOfProgrammes,
    $background = "bg-decorative3-very-subdued",
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
