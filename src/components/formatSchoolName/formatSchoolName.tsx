import { ReactNode } from "react";

export const formatSchoolName = (
  schoolName: ReactNode,
  inputValue: string | undefined,
) => {
  const schoolNameString = `${schoolName}`;
  const inputValueString = inputValue || "";
  const regexPattern = new RegExp(inputValueString, "i");
  const firstIndexOfPattern = schoolNameString.search(regexPattern);
  const sliceToMakeBold = schoolNameString.slice(
    firstIndexOfPattern,
    firstIndexOfPattern + (inputValueString.length || 0),
  );
  const schoolNameWithBoldInput = schoolNameString.replace(
    sliceToMakeBold,
    `<strong>${sliceToMakeBold}</strong>`,
  );

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: schoolNameWithBoldInput,
      }}
    />
  );
};
