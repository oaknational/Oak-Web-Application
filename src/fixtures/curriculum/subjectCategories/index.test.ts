import { createSubjectCategory } from "./index";

describe("createSubjectCategory", () => {
  it("default subject category", () => {
    const result = createSubjectCategory();
    expect(result).toEqual({
      id: 1,
      slug: "foo",
      title: "Foo",
    });
  });

  it("pass id", () => {
    const result = createSubjectCategory({ id: 999 });
    expect(result).toEqual({
      id: 999,
      slug: "foo",
      title: "Foo",
    });
  });

  it("pass title", () => {
    const result = createSubjectCategory({ title: "Badger" });
    expect(result).toEqual({
      id: 1,
      slug: "foo",
      title: "Badger",
    });
  });

  it("create an array of subject categories", () => {
    const result = [
      createSubjectCategory({ id: 1, slug: "foo", title: "Foo" }),
      createSubjectCategory({ id: 2, slug: "bar", title: "Bar" }),
      createSubjectCategory({ id: 3, slug: "baz", title: "Baz" }),
    ];
    expect(result).toEqual([
      { id: 1, slug: "foo", title: "Foo" },
      { id: 2, slug: "bar", title: "Bar" },
      { id: 3, slug: "baz", title: "Baz" },
    ]);
  });
});
