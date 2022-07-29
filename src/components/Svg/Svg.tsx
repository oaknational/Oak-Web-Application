import { FC } from "react";

import getSvgId from "../SpriteSheet/getSvgId";

type SvgProps = {
  name: string;
};
const Svg: FC<SvgProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <use xlinkHref={`#${getSvgId(props)}`} />
    </svg>
  );
};

export default Svg;
