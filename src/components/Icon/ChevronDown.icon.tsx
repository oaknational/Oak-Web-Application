import { FC } from "react";

import { SvgProps } from "../SpriteSheet/getSvgId";

const ChevronDown: FC<SvgProps> = (props) => {
  return (
    <symbol
      viewBox="-4 -5 22 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="m13.781 1.25-.594-.625c-.156-.156-.406-.156-.53 0L7 6.281 1.312.625C1.188.469.938.469.782.625l-.595.625c-.156.125-.156.375 0 .531L6.72 8.313a.36.36 0 0 0 .531 0l6.531-6.532c.156-.156.156-.406 0-.531Z"
        fill="currentColor"
      />
    </symbol>
  );
};

export default ChevronDown;
