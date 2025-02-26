import { createSubjectCategory } from "./index";

describe("createSubjectCategory", () => {
  it("default subject category", () => {
    const result = createSubjectCategory();
    expect(result).toEqual({
      id: 1,
      title: "Foo",
    });
  });

  it("pass id", () => {
    const result = createSubjectCategory({ id: 999 });
    expect(result).toEqual({
      id: 999,
      title: "Foo",
    });
  });

  it("pass title", () => {
    const result = createSubjectCategory({ title: "Badger" });
    expect(result).toEqual({
      id: 1,
      title: "Badger",
    });
  });

  it("create an array of subject categories", () => {
    const result = [
      createSubjectCategory({ id: 1, title: "Foo" }),
      createSubjectCategory({ id: 2, title: "Bar" }),
      createSubjectCategory({ id: 3, title: "Baz" }),
    ];
    expect(result).toEqual([
      { id: 1, title: "Foo" },
      { id: 2, title: "Bar" },
      { id: 3, title: "Baz" },
    ]);
  });
});
