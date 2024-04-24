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
    subjects: parsed.subjects.filter(
      // TODO: this test subject should not be published in production
      (s) => s.slug !== "testing-not-for-publication",
    ),
  };
};

export default searchPageQuery;
