import { Sdk } from "../../sdk";

import { UnitvariantLessonsSchema } from "./getIsUnitvariantGeorestricted.schema";

import OakError from "@/errors/OakError";

const getIsUnitvariantGeorestrictedQuery =
  (sdk: Sdk) =>
  async (args: { unitProgrammeSlug: string }): Promise<boolean> => {
    const { unitProgrammeSlug } = args;

    const lastHyphenIndex = unitProgrammeSlug.lastIndexOf("-");
    if (lastHyphenIndex === -1) {
      throw new Error("Invalid unitProgrammeSlug format");
    }

    const unitvariantIdStr = unitProgrammeSlug.substring(lastHyphenIndex + 1);
    if (!unitvariantIdStr || isNaN(Number(unitvariantIdStr))) {
      throw new Error("Invalid unitvariantId extracted from unitProgrammeSlug");
    }

    const unitvariantId = Number(unitvariantIdStr);

    const res = await sdk.unitvariantLessonsById({ unitvariantId });
    const { unitvariant_lessons } = res;

    const parsedLessons =
      UnitvariantLessonsSchema.safeParse(unitvariant_lessons);

    if (!parsedLessons.success) {
      throw new Error(
        `Invalid unitvariant_lessons format: ${parsedLessons.error.message}`,
      );
    }

    if (!unitvariant_lessons || unitvariant_lessons.length === 0) {
      throw new OakError({
        code: "curriculum-api/not-found",
        meta: { resource: "unitvariant_lessons", unitvariantId },
      });
    }

    // Check if any lesson is geo-restricted
    return unitvariant_lessons.some(
      (item) =>
        (item.lesson?.features as { agf__geo_restricted?: boolean })
          ?.agf__geo_restricted === true,
    );
  };

export default getIsUnitvariantGeorestrictedQuery;
