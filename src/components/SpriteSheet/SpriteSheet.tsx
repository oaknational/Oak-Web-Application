import { FC } from "react";

import { iconSymbols, ICON_NAMES } from "../Icon/Icon";

import { svgSymbols as boxBorderSymbols } from "./BrushSvgs/BoxBorders";
import { svgSymbols as buttonBorderSymbols } from "./BrushSvgs/ButtonBorders";
import IconBackground from "./BrushSvgs/IconBackground";
import getSvgId from "./getSvgId";

const SpriteSheet: FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
      {ICON_NAMES.map((name) => {
        const IconSymbol = iconSymbols[name];

        return <IconSymbol id={getSvgId({ name })} />;
      })}
      {Object.values(boxBorderSymbols).map((Symbol) => (
        <Symbol />
      ))}
      {Object.values(buttonBorderSymbols).map((Symbol) => (
        <Symbol />
      ))}
      <IconBackground id={getSvgId({ name: "icon-brush-background" })} />
    </svg>
  );
};

export default SpriteSheet;
