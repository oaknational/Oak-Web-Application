import argsRemoveLegacySlugSuffix, {
  RequestHeadersType,
  VariablesType,
} from "./argsRemoveLegacySlugSuffix";
import { LEGACY_SLUG_SUFFIX } from "./isSlugLegacy";

let sampleVariables: VariablesType;
let sampleHeaders: RequestHeadersType;

describe("argsRemoveLegacySlugSuffix", () => {
  beforeEach(() => {
    sampleVariables = {
      programmeSlug: `a-legacy-programme-slug${LEGACY_SLUG_SUFFIX}`,
      subjectSlug: `a-legacy-subject-slug${LEGACY_SLUG_SUFFIX}`,
      unitSlug: "a-unit-slug",
      anyOtherKey: "a-value",
    };

    sampleHeaders = {
      Authorization: "Bearer your-token",
    };
  });
  it(`returns args with programme slug without ${LEGACY_SLUG_SUFFIX} suffix`, () => {
    const modifiedArgs = argsRemoveLegacySlugSuffix([
      sampleVariables,
      sampleHeaders,
    ]);
    expect(modifiedArgs[0].programmeSlug).toEqual("a-legacy-programme-slug");
    expect(modifiedArgs[0].subjectSlug).toEqual("a-legacy-subject-slug");
    expect(modifiedArgs[0].unitSlug).toEqual("a-unit-slug");
    expect(modifiedArgs[1]).toEqual(sampleHeaders);
  });
});
