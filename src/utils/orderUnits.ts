import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

export const orderUnits = (units: UnitListingData["units"]) => {
  const swimmingUnits = units.filter(
    (item) => item[0]!.groupUnitsAs === "Swimming and water safety",
  );

  if (swimmingUnits.length > 0) {
    return [
      ...swimmingUnits,
      ...units.filter(
        (item) => item[0]!.groupUnitsAs !== "Swimming and water safety",
      ),
    ];
  }

  return units;
};
