import { createFilter } from "@/fixtures/curriculum/filters";
import { createUnit } from "@/fixtures/curriculum/unit";
import { createYearData } from "@/fixtures/curriculum/yearData";

export const basicFixtures = {
  units: [
    createUnit({ slug: "one" }),
    createUnit({ slug: "two" }),
    createUnit({ slug: "three" }),
    createUnit({ slug: "four" }),
  ],
  yearData: {
    "7": createYearData({}),
  },
  year: "1",
  filters: createFilter({}),
  basePath: "/",
};
