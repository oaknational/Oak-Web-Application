import { createUnit } from "@/fixtures/curriculum/unit";
import { createUnitOption } from "@/fixtures/curriculum/unitOption";

export const unitWithOptions = createUnit({
  slug: "something-nice",
  unit_options: [
    createUnitOption({
      slug: "really-nice",
    }),
    createUnitOption({
      slug: "kind-of-nice",
    }),
  ],
});
