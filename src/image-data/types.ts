import uiIcons from "./ui-icons.json";
import uiGraphics from "./ui-graphics.json";

export type UiIconName = keyof typeof uiIcons;
export type UiGraphicName = keyof typeof uiGraphics;

export const ICON_NAMES = Object.keys(uiIcons) as UiIconName[];
export const GRAPHIC_NAMES = Object.keys(uiGraphics) as UiGraphicName[];
