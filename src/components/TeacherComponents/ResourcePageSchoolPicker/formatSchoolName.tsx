import { OakSpan } from "@oaknational/oak-components";

export const formatSchoolName = (
  schoolName: string,
  inputValue: string | undefined,
) => {
  if (!inputValue) {
    return <OakSpan $font={"heading-light-7"}>{schoolName}</OakSpan>;
  }

  const escapedInput = RegExp.escape(inputValue);
  const splitRegex = new RegExp(`(${escapedInput})`, "gi");
  const exactMatchRegex = new RegExp(`^${escapedInput}$`, "i");
  const splitSchoolName = schoolName.split(splitRegex);

  return (
    <OakSpan $font={"heading-light-7"}>
      {splitSchoolName.map((part: string, index: number) => (
        <OakSpan key={index}>
          {exactMatchRegex.test(part) ? (
            <OakSpan
              $font={"body-2-bold"}
              $textDecoration={"underline"}
              $color={"text-link-active"}
              data-testid="strong-element"
            >
              {part}
            </OakSpan>
          ) : (
            part
          )}
        </OakSpan>
      ))}
    </OakSpan>
  );
};
