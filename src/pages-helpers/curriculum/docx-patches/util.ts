// Safe version of String#includes(...)
export const textIncludes = (str: unknown, matchText: string) => {
  if (typeof str === "string") {
    return str.includes(matchText);
  }
  return false;
};

// Safe version of String#replace(...)
export const textReplacer = (
  input: unknown,
  selector: string,
  value: string,
) => {
  if (typeof input === "string") {
    return input.replace(selector, value);
  }
  return input;
};
