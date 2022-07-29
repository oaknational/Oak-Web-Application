import { FC } from "react";

import { SvgProps } from "../SpriteSheet/getSvgId";

const Share: FC<SvgProps> = (props) => {
  return (
    <symbol
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </symbol>
  );
};

export default Share;
