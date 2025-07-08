import { FC } from "react";

import { InlineSpriteSvgName } from "@/image-data";

export type SvgProps = {
  name: InlineSpriteSvgName;
  color?: string;
};
const Svg: FC<SvgProps> = (props) => {
  const { name, color } = props;
  return (
    <svg
      aria-hidden={true}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      color={color ?? undefined}
    >
      <use xlinkHref={`#${name}`} />
    </svg>
  );
};

export default Svg;
