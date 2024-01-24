import { Sdk } from "../../sdk";
import { searchPageSchema } from "../../";

import OakError from "@/errors/OakError";

const searchPageQuery = (sdk: Sdk) => async () => {
  const res = await sdk.searchPage();

  const [searchPage] = res.searchPage;
  if (!searchPage) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  return searchPageSchema.parse({
    ...searchPage,
  });
};

export default searchPageQuery;
