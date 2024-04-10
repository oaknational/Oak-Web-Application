import { rawSearchResponseSchema } from "../../search.schema";

import elasticResponse2023 from "./elasticResponse.2023.fixture.json";
import { transformAndParseSearchResponseData } from "./fetchResults";

export const rawSearchResults =
  rawSearchResponseSchema.parse(elasticResponse2023);

export const hitsFixture =
  transformAndParseSearchResponseData(rawSearchResults).hits.hits;
