import Presentation from "./Presentation.icon";
import Slidedeck from "./Presentation.icon";
import Quiz from "./Quiz.icon";
import Video from "./Video.icon";
import Worksheet from "./Worksheet.icon";

const lessonElementSvgSymbols = {
  Presentation,
  Slidedeck,
  Quiz,
  Video,
  Worksheet,
};

export const LESSON_ELEMENT_NAMES = Object.keys(
  lessonElementSvgSymbols
) as Array<keyof typeof lessonElementSvgSymbols>;
export type LessonElementSvgName = keyof typeof lessonElementSvgSymbols;

export default lessonElementSvgSymbols;
