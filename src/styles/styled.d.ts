import "styled-components";

import { OakTheme } from "./theme";

declare module "styled-components" {
   
  export interface DefaultTheme extends OakTheme {}
}
