import { FC } from "react";

import { SvgProps } from "../SpriteSheet/getSvgId";

const PaperPlane: FC<SvgProps> = (props) => {
  return (
    <symbol viewBox="0 0 34 34" {...props}>
      <path
        d="M30 1.313 2 17.438C.562 18.25.687 20.375 2.188 21L11 24.625V31c0 1.938 2.313 2.75 3.5 1.313l3.813-4.626 7.875 3.25a2 2 0 0 0 2.75-1.562l4-26.063c.25-1.624-1.5-2.874-2.938-2ZM13 31v-5.5l3.375 1.375L13 31Zm14-1.875L14.062 23.75l12.5-14.688c.313-.374-.187-.874-.562-.562L10.062 22.125 3 19.187 31 3l-4 26.125Z"
        fill="currentColor"
      />
    </symbol>
  );
};

export default PaperPlane;
