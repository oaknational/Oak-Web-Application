import { createLesson } from ".";

describe("createThread", () => {
  it("basic", () => {
    const result = createLesson();
    expect(result).toEqual({
      slug: "test",
      title: "Test",
      _state: "published",
    });
  });

  it("passing slug", () => {
    const result = createLesson({
      slug: "foo",
    });
    expect(result).toEqual({
      slug: "foo",
      title: "Foo",
      _state: "published",
    });
  });

  it("passing slug overriding title", () => {
    const result = createLesson({
      slug: "foo",
      title: "Bar",
    });
    expect(result).toEqual({
      slug: "foo",
      title: "Bar",
      _state: "published",
    });
  });
});
