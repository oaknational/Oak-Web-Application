import { FactorData } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";
import OakError from "@/errors/OakError";

export const getFactorDataFromSlug = ({
  factorSlug,
  availableFactors,
}: {
  factorSlug: FactorData["factorSlug"];
  availableFactors: FactorData[];
}): FactorData => {
  const v = availableFactors.find((f) => f.factorSlug === factorSlug);

  if (!v) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  return v;
};
