import { ReactNode } from "react";

export const formatSchoolName = (
  schoolName: ReactNode,
  inputValue: string | undefined,
) => {
  const schoolNameString = `${schoolName}`;
  const inputValueString = inputValue || "";
  const regexPattern = new RegExp(inputValueString, "i");
  const schoolNameWithBoldInput = schoolNameString.replace(
    schoolNameString.slice(
      schoolNameString.search(regexPattern),
      schoolNameString.search(regexPattern) + (inputValueString.length || 0),
    ),
    `<strong>${schoolNameString.slice(
      schoolNameString.search(regexPattern),
      schoolNameString.search(regexPattern) + (inputValueString.length || 0),
    )}</strong>`,
  );

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: schoolNameWithBoldInput,
      }}
    />
  );
};
