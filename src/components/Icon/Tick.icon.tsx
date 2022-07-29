import { FC } from "react";

import { SvgProps } from "../SpriteSheet/getSvgId";

const Tick: FC<SvgProps> = (props) => {
  return (
    <symbol viewBox="0 0 20 15" {...props}>
      <path
        d="M7.082 14.219a.934.934 0 0 0 1.3 0L18.72 3.883a.934.934 0 0 0 0-1.301l-1.266-1.266a.891.891 0 0 0-1.265 0L7.75 9.754 3.777 5.816a.891.891 0 0 0-1.265 0L1.246 7.082a.934.934 0 0 0 0 1.3l5.836 5.837Z"
        fill="currentColor"
      />
    </symbol>
  );
};

export default Tick;
