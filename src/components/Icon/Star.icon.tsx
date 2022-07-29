import { FC } from "react";

import { SvgProps } from "../SpriteSheet/getSvgId";

const Star: FC<SvgProps> = (props) => {
  return (
    <symbol viewBox="2 2 20 20" {...props}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </symbol>
  );
};

export default Star;
