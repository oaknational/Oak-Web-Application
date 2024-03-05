import sdk from "../../sdk";

import specialistSubjectListingQuery from "./specialistSubjectListing.query";

describe("specialist subject listing", () => {
  test("it runs", async () => {
    const res = await specialistSubjectListingQuery({
      ...sdk,
      specialistSubjectListing: jest.fn(() =>
        Promise.resolve({
          therapyProgrammes: [],
          specialistProgrammes: [],
        }),
      ),
    })();

    expect(res).toBeDefined();
  });
});
