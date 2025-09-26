import { OAK_SUBJECTS } from "../oakCurriculumData";

import { getMatch } from "./getMatch";

describe("getMatch", () => {
  it("should return a single match", () => {
    const result = getMatch("french", OAK_SUBJECTS);
    expect(result).toBe("french");
  });
  it.todo("should match on title");
  it.todo("should match on aliases");
});
