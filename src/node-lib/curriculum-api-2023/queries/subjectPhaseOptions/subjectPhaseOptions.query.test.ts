import sdk from "../../sdk";

import subjectPhaseOptions from "./subjectPhaseOptions.query";

describe("subjectPhaseOptions()", () => {
  it("throws a not found error if no options are found", async () => {
    await expect(async () => {
      await subjectPhaseOptions({
        ...sdk,
        subjectPhaseOptions: vi.fn(() => Promise.resolve({ options: [] })),
      })();
    }).rejects.toThrow(`Resource not found`);
  });

  it("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await subjectPhaseOptions({
        ...sdk,
        subjectPhaseOptions: vi.fn(() =>
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
