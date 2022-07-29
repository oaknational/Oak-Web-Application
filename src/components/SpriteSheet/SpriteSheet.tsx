import { FC } from "react";

import { brushSymbols } from "../BrushBorders/BrushBorders";
import { buttonSymbols } from "../Button/ButtonBorders/ButtonBorders";
import { iconSymbols, ICON_NAMES } from "../Icon/Icon";

import getSvgId from "./getSvgId";

const SpriteSheet: FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
      {ICON_NAMES.map((name) => {
        const IconSymbol = iconSymbols[name];

        return <IconSymbol id={getSvgId({ name })} />;
      })}
      {Object.values(brushSymbols).map((Symbol) => (
        <Symbol />
      ))}
      {Object.values(buttonSymbols).map((Symbol) => (
        <Symbol />
      ))}
    </svg>
  );
};

export default SpriteSheet;
