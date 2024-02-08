import { FC, useState } from "react";
import { OakFlex } from "@oaknational/oak-components";

import { calcDims } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import QuizOakImage from "@/components/TeacherComponents/QuizOakImage";
import { StemImageObject } from "@/node-lib/curriculum-api-2023/shared.schema";

type ImageProps = { src: StemImageObject["image_object"]; alt?: string };

const QuizImage: FC<ImageProps> = ({ src, alt }) => {
  const [dims, setDims] = useState(calcDims(src.width, src.height));

  return (
    <OakFlex
      $overflow={"hidden"}
      $position={"relative"}
      $minWidth={dims.width ? undefined : "all-spacing-14"}
      $minHeight={dims.height ? undefined : "all-spacing-14"}
      $justifyContent={"center"}
    >
      <QuizOakImage src={src} dims={dims} setDims={setDims} alt={alt} />
    </OakFlex>
  );
};

export default QuizImage;
