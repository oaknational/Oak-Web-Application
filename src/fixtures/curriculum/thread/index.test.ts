import { createThread } from ".";

describe("createThread", () => {
  it("keys are correct", () => {
    const result = createThread();
    expect(result).toEqual({
      title: "Foo",
      slug: "foo",
      order: 1,
    });
  });
});
