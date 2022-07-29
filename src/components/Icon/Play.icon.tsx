import { FC } from "react";

import { SvgProps } from "../SpriteSheet/getSvgId";

const Play: FC<SvgProps> = (props) => {
  return (
    <symbol viewBox="0 0 48 48" {...props}>
      <path
        d="m34.781 22.313-16.5-10.032c-1.5-.75-3.281.281-3.281 1.969v19.5c0 1.781 1.781 2.813 3.281 1.969l16.5-9.469c1.594-.844 1.594-3 0-3.938ZM47.25 24C47.25 11.156 36.844.75 24 .75S.75 11.156.75 24 11.156 47.25 24 47.25 47.25 36.844 47.25 24Zm-42 0C5.25 13.687 13.594 5.25 24 5.25c10.313 0 18.75 8.438 18.75 18.75 0 10.406-8.438 18.75-18.75 18.75A18.685 18.685 0 0 1 5.25 24Z"
        fill="currentColor"
      />
    </symbol>
  );
};

export default Play;
