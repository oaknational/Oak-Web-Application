import { createChildSubject } from "./index";

describe("createChildSubject", () => {
  it("default childSubject", () => {
    const result = createChildSubject();
    expect(result).toEqual({
      subject_slug: "blank",
      subject: "Blank",
    });
  });

  it("pass slug", () => {
    const result = createChildSubject({ subject_slug: "test" });
    expect(result).toEqual({
      subject_slug: "test",
      subject: "Test",
    });
  });

  it("pass title", () => {
    const result = createChildSubject({ subject: "Test" });
    expect(result).toEqual({
      subject_slug: "blank",
      subject: "Test",
    });
  });
});
