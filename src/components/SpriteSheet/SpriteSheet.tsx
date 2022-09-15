import { FC } from "react";

import iconSvgSymbols, { ICON_NAMES } from "./IconSvgs";
import { svgSymbols as boxBorderSymbols } from "./BrushSvgs/BoxBorders";
import { svgSymbols as buttonBorderSymbols } from "./BrushSvgs/ButtonBorders";
import { svgSymbols as brushBorderSymbols } from "./BrushSvgs/BrushBorders";
import IconBackground from "./BrushSvgs/IconBackground";
import getSvgId from "./getSvgId";
import graphicSvgSymbols, { GRAPHIC_NAMES } from "./GraphicSvgs";
import lessonElementSvgSymbols, {
  LESSON_ELEMENT_NAMES,
} from "./LessonElementSvgs";
import brushSvgSymbols, { BRUSH_NAMES } from "./BrushSvgs";
import loopingLineSvgSymbols, { LOOPING_LINES } from "./LoopingLineSvgs";

const SpriteSheet: FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
      {ICON_NAMES.map((name) => {
        const IconSymbol = iconSvgSymbols[name];
        return (
          <IconSymbol key={`spritesheet-${name}`} id={getSvgId({ name })} />
        );
      })}
      {GRAPHIC_NAMES.map((name) => {
        const GraphicSymbol = graphicSvgSymbols[name];
        return (
          <GraphicSymbol key={`spritesheet-${name}`} id={getSvgId({ name })} />
        );
      })}
      {LESSON_ELEMENT_NAMES.map((name) => {
        const LessonElementSymbol = lessonElementSvgSymbols[name];
        return (
          <LessonElementSymbol
            key={`spritesheet-${name}`}
            id={getSvgId({ name })}
          />
        );
      })}
      {Object.entries(boxBorderSymbols).map(([name, Symbol]) => (
        <Symbol key={`spritesheet-${name}`} />
      ))}
      {Object.entries(buttonBorderSymbols).map(([name, Symbol]) => (
        <Symbol key={`spritesheet-${name}`} />
      ))}
      {Object.entries(brushBorderSymbols).map(([name, Symbol]) => (
        <Symbol key={`spritesheet-${name}`} />
      ))}
      <IconBackground id={getSvgId({ name: "icon-brush-background" })} />
      {BRUSH_NAMES.map((name) => {
        const BrushSymbol = brushSvgSymbols[name];
        return (
          <BrushSymbol key={`spritesheet-${name}`} id={getSvgId({ name })} />
        );
      })}
      {LOOPING_LINES.map((name) => {
        const BrushSymbol = loopingLineSvgSymbols[name];
        return (
          <BrushSymbol key={`spritesheet-${name}`} id={getSvgId({ name })} />
        );
      })}
    </svg>
  );
};

export default SpriteSheet;
