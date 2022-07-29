import { IconName } from "../Icon";

export type SvgProps = {
  id: string; // @todo type this
};

type SvgName = IconName;

type GetSvgIdProps = {
  name: SvgName;
};
const getSvgId = ({ name }: GetSvgIdProps) => {
  return `svg-sprite-${name}`;
};

export default getSvgId;
