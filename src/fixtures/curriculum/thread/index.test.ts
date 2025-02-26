import { createThread } from ".";

describe("createThread", () => {
  it("keys are correct", () => {
    const result = createThread();
    expect(result).toEqual({
      title: "Test",
      slug: "test",
      order: 1,
    });
  });
});
