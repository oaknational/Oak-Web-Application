import { FC } from "react";

import { SvgProps } from "../SpriteSheet/getSvgId";

const Download: FC<SvgProps> = (props) => {
  return (
    <symbol
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </symbol>
  );
};

export default Download;
