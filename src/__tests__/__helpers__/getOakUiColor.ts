import { oakDefaultTheme } from "@oaknational/oak-components";

import theme from "@/styles/theme";
import type { OakColorName } from "@/styles/theme/types";

export type OakUiColorToken = keyof typeof oakDefaultTheme.uiColors;

export function getOakUiColor(token: OakUiColorToken): string {
  const colorName = oakDefaultTheme.uiColors[token] as OakColorName;
  return theme.colors[colorName];
}
