import { UiGraphicName, UiIconName } from "../../image-data";

export type SvgProps = {
  id: string;
};

export type SvgName = UiIconName | UiGraphicName;

type GetSvgIdProps = {
  name: SvgName;
};
const getSvgId = ({ name }: GetSvgIdProps) => {
  return `svg-sprite-${name}`;
};

export default getSvgId;
