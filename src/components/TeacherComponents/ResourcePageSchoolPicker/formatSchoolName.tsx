import { ReactNode } from "react";
import { OakSpan } from "@oaknational/oak-components";

export const formatSchoolName = (
  schoolName: ReactNode,
  inputValue: string | undefined,
) => {
  const schoolNameString = `${schoolName}`;
  const inputValueString = inputValue || "";
  const regexPattern = new RegExp(inputValueString, "i");
  const firstIndexOfPattern = schoolNameString.search(regexPattern);
  const splitSchoolName = schoolNameString.split(regexPattern);
  const sliceToMakeBold = schoolNameString.slice(
    firstIndexOfPattern,
    firstIndexOfPattern + (inputValueString.length || 0),
  );

  return (
    <OakSpan $font={"heading-light-7"}>
      {splitSchoolName.map((splitSchoolNameItem: string, index: number) => {
        return (
          <OakSpan>
            {`${splitSchoolNameItem}`}
            {index < splitSchoolName.length - 1 && (
              <OakSpan
                $font={"body-2-bold"}
                $textDecoration={"underline"}
                $color={"blue"}
                data-testid="strong-element"
              >
                {sliceToMakeBold}
              </OakSpan>
            )}
          </OakSpan>
        );
      })}
    </OakSpan>
  );
};
