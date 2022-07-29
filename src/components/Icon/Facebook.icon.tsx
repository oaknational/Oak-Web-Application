import { FC } from "react";

import { SvgProps } from "../SpriteSheet/getSvgId";

const Facebook: FC<SvgProps> = (props) => {
  return (
    <symbol viewBox="0 0 22 22" {...props}>
      <path
        d="M19.688 10.166A9.686 9.686 0 0 0 10 .48a9.686 9.686 0 0 0-9.688 9.688c0 4.843 3.516 8.867 8.165 9.57v-6.758H6.016v-2.813h2.46V8.057c0-2.422 1.446-3.789 3.633-3.789 1.094 0 2.188.195 2.188.195v2.383h-1.211c-1.211 0-1.602.742-1.602 1.524v1.796h2.696l-.43 2.813h-2.266v6.758c4.649-.703 8.204-4.727 8.204-9.57Z"
        fill="currentColor"
      />
    </symbol>
  );
};

export default Facebook;
