import "styled-components";

import type { OakTheme } from "./theme/types";

/**
 * This file extends the styled-components DefaultTheme interface
 * to incorporate our OakTheme. Since styled-components v6 is natively
 * TypeScript, we only need to extend the DefaultTheme interface.
 */

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends OakTheme {}
}
