import { GraphicSvgName } from "./GraphicSvgs";
import { IconSvgName } from "./IconSvgs";
import { LessonElementSvgName } from "./LessonElementSvgs";

export type SvgProps = {
  id: string; // @todo type this
};

export type SvgName =
  | IconSvgName
  | GraphicSvgName
  | LessonElementSvgName
  // @todo name the below types
  | "icon-brush-background"
  | "box-border-top"
  | "box-border-right"
  | "box-border-bottom"
  | "box-border-left"
  | "button-border-top"
  | "button-border-right"
  | "button-border-bottom"
  | "button-border-left";

type GetSvgIdProps = {
  name: SvgName;
};
const getSvgId = ({ name }: GetSvgIdProps) => {
  return `svg-sprite-${name}`;
};

export default getSvgId;
