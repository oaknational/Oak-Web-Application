import { FC } from "react";

import getSvgId, { SvgName } from "../SpriteSheet/getSvgId";

type SvgProps = {
  name: SvgName;
};
const Svg: FC<SvgProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      {...props}
    >
      <use xlinkHref={`#${getSvgId(props)}`} />
    </svg>
  );
};

export default Svg;
