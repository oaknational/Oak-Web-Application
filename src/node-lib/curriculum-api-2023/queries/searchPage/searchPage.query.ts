import { Sdk } from "../../sdk";
import { searchPageSchema } from "../../";

import OakError from "@/errors/OakError";

const searchPageQuery = (sdk: Sdk) => async () => {
  const res = await sdk.searchPage();
  const [searchPage] = res.searchPage;
  if (!searchPage) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  const parsed = searchPageSchema.parse(searchPage);

  return {
    ...parsed,
    // Remove filtering when Rule of law published
    subjects: parsed.subjects.filter((s) => s.slug !== "rule-of-law"),
  };
};

export default searchPageQuery;
