import sdk from "../../sdk";

import subjectPhaseOptionsIncludeNew from "./subjectPhaseOptionsIncludeNew.query";

describe("subjectPhaseOptionsIncludeNew()", () => {
  test("throws a not found error if no options are found", async () => {
    await expect(async () => {
      await subjectPhaseOptionsIncludeNew({
        ...sdk,
        subjectPhaseOptionsIncludeNew: jest.fn(() =>
          Promise.resolve({ options: [] }),
        ),
      })();
    }).rejects.toThrow(`Resource not found`);
  });

  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await subjectPhaseOptionsIncludeNew({
        ...sdk,
        subjectPhaseOptionsIncludeNew: jest.fn(() =>
          Promise.resolve({
            options: [
              {
                slug: "test-subject",
                title: "Test Subject",
                // phases missing from response
              },
            ],
          }),
        ),
      })();
    }).rejects.toThrow(`phases`);
  });
});
