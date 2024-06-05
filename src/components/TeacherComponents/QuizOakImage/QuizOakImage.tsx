import { Dispatch, FC, SetStateAction } from "react";

import { calcDims } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import OwaImage from "@/components/SharedComponents/OwaImage";
import { StemImageObject } from "@/node-lib/curriculum-api-2023/shared.schema";

type QuizOakImageProps = {
  src: StemImageObject["image_object"];
  alt?: string;
  dims:
    | {
        width: number;
        height: number;
      }
    | {
        width: undefined;
        height: undefined;
      };
  setDims: Dispatch<
    SetStateAction<
      | {
          width: number;
          height: number;
        }
      | {
          width: undefined;
          height: undefined;
        }
    >
  >;
};

const QuizOakImage: FC<QuizOakImageProps> = ({ src, alt, dims, setDims }) => {
  return dims.width && dims.height ? (
    <OwaImage
      $objectPosition={["center", "left"]}
      width={dims.width}
      height={dims.height}
      src={src.secure_url}
      alt={alt ?? ""}
      style={{ objectFit: "contain" }}
    />
  ) : (
    <OwaImage
      $objectPosition={["center", "left"]}
      fill
      src={src.secure_url}
      alt={alt ?? ""}
      style={{ objectFit: "contain" }}
      onLoad={(e) => {
        setDims(
          calcDims(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight),
        );
      }}
    />
  );
};

export default QuizOakImage;
