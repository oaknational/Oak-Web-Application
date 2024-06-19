import { OakP, OakPProps } from "@oaknational/oak-components";
import { FC } from "react";
import styled from "styled-components";

import Box, { BoxProps } from "@/components/SharedComponents/Box";

const BoxFieldSet = styled(Box)`
  padding-inline-start: 0;
  padding-inline-end: 0;
  border: none;
`;

export const Fieldset = (props: Omit<BoxProps, "as">) => {
  return <BoxFieldSet {...props} as="fieldset" />;
};

const OakPLegend = styled(OakP)`
  padding-inline-start: 0;
  padding-inline-end: 0;
  border: none;
`;

export const FieldsetLegend: FC<
  Omit<OakPProps, "as"> & { children?: React.ReactNode }
> = (props) => {
  return <OakPLegend {...props} as="legend" />;
};
