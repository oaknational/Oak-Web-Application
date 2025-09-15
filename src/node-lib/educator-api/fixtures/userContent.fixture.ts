import { UserContentResponse } from "../queries/getUserContent/getUserContent.types";

const userContentFixture = (
  partial?: Partial<UserContentResponse["users_content"]>,
): UserContentResponse => {
  return {
    users_content: partial
      ? partial.filter((item) => item !== undefined)
      : [{ users_content_lists: { content: { unit_slug: "unit1" } } }],
  };
};
export default userContentFixture;
