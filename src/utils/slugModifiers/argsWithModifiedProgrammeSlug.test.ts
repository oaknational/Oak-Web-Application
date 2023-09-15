import argsWithModifiedProgrammeSlug, {
  RequestHeadersType,
  VariablesType,
} from "./argsWithModifiedProgrammeSlug";

let sampleVariables: VariablesType;
let sampleHeaders: RequestHeadersType;

describe("argsWithModifiedProgrammeSlug", () => {
  beforeEach(() => {
    sampleVariables = {
      programmeSlug: "a-legacy-programme-slug-l",
      unitSlug: "a-unit-slug",
      anyOtherKey: "a-value",
    };

    sampleHeaders = {
      Authorization: "Bearer your-token",
    };
  });
  it("returns args with programme slug without '-l' suffix", () => {
    const modifiedArgs = argsWithModifiedProgrammeSlug([
      sampleVariables,
      sampleHeaders,
    ]);
    expect(modifiedArgs[0].programmeSlug).toEqual("a-legacy-programme-slug");
    expect(modifiedArgs[0].unitSlug).toEqual("a-unit-slug");
    expect(modifiedArgs[1]).toEqual(sampleHeaders);
  });
});
