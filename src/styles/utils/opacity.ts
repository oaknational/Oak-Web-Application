import { css } from "styled-components";

import responsive, { ResponsiveValues } from "./responsive";

type Opacity = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
type ResponsiveOpacity = ResponsiveValues<Opacity>;

export type OpacityProps = { $opacity?: ResponsiveOpacity };
const opacity = css<OpacityProps>`
  ${responsive<OpacityProps, Opacity>("opacity", (props) => props.$opacity)}
`;

export default opacity;
