import { FC } from "react";

import { SvgProps } from "../SpriteSheet/getSvgId";

const ChevronRight: FC<SvgProps> = (props) => {
  return (
    <symbol
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </symbol>
  );
};

export default ChevronRight;
