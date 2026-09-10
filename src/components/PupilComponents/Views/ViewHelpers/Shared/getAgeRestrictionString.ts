export const getAgeRestrictionString = (
  ageRestriction: string | undefined | null,
) => {
  switch (ageRestriction) {
    case "7_and_above":
      return "To view this lesson, you must be in year 7 and above";
    case "10_and_above":
      return "To view this lesson, you must be in year 10 and above";
    default:
      return "This lesson is age restricted.";
  }
};
