export const toSentenceCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/* When including Core on the MV it returns on all subjects even if they do not have Core tier data,
 this function removes core from programmes that shouldn't have Core as an option*/
const hasCoreTierSet = new Set(["maths-ks4"]);
export const isTierValid = (
  legacy: boolean,
  tierSlug: string,
  subjectSlug?: string | null,
  keyStageSlug?: string | null,
) => {
  const key = `${subjectSlug}-${keyStageSlug}`;
  if (!hasCoreTierSet.has(key) || !legacy) {
    return tierSlug !== "core";
  } else {
    return true;
  }
};
