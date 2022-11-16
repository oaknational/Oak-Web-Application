import { FC } from "react";

import { SvgProps } from "../getSvgId";

const Bubble: FC<SvgProps> = (props: SvgProps) => {
  return (
    <symbol viewBox="-10 0 410 378" fill="none" {...props}>
      <path
        fill="currentColor"
        d="M.02 196.812C-.958 95.725 82.636 7.723 179.06.73c80.944-5.816 147.178 22.988 190.822 90.564 58.425 90.494 29.352 195.736-65.606 252.719-11.922 6.923-25.169 12.186-36.603 19.94-57.379 39.397-154.638 17.517-197.585-37.665-6.275-8.101-14.433-14.817-21.614-22.364C17.728 271.52-.678 234.201.019 196.812Z"
      />
    </symbol>
  );
};

export default Bubble;
