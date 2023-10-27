import { ReactNode } from "react";

import { Span } from "../Typography";

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
    <Span $font={"heading-light-7"}>
      {splitSchoolName.map((splitSchoolNameItem: string, index: number) => {
        return (
          <Span>
            {`${splitSchoolNameItem}`}
            {index < splitSchoolName.length - 1 && (
              <Span
                $font={"body-2-bold"}
                $textDecoration={"underline"}
                $color={"teachersHighlight"}
                data-testid="strong-element"
              >
                {sliceToMakeBold}
              </Span>
            )}
          </Span>
        );
      })}
    </Span>
  );
};
