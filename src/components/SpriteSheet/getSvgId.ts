import { IconName } from "../Icon";

export type SvgProps = {
  id: string; // @todo type this
};

export type SvgName =
  | IconName
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
