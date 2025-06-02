import { getTitleFromSlug } from "../../shared/helper";

import { UnitOption } from "@/utils/curriculum/types";

const BASE_UNIT_OPTION: UnitOption = {
  unitvariant_id: 1,
  connection_prior_unit_description: null,
  connection_future_unit_description: null,
  connection_future_unit_title: null,
  connection_prior_unit_title: null,
  slug: "test",
  title: "Test",
  lessons: [],
  description: null,
  why_this_why_now: null,
  state: "published",
};

export function createUnitOption(partial: Partial<UnitOption> = {}) {
  const title = getTitleFromSlug(partial?.slug);

  return {
    ...BASE_UNIT_OPTION,
    ...(title ? { title } : {}),
    ...partial,
  };
}
