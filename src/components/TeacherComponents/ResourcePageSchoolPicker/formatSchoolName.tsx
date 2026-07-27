import { OakSpan } from "@oaknational/oak-components";

const toAlphanumericOnly = (value: string) => value.replace(/[^a-z0-9]/gi, "");

export const formatSchoolName = (
  schoolName: string,
  inputValue: string | undefined = "",
) => {
  const normalizedInput = toAlphanumericOnly(inputValue);

  if (!normalizedInput) {
    return <OakSpan $font={"heading-light-7"}>{schoolName}</OakSpan>;
  }

  const splitRegex = new RegExp(`(${normalizedInput})`, "gi");
  const exactMatchRegex = new RegExp(`^${normalizedInput}$`, "i");
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
