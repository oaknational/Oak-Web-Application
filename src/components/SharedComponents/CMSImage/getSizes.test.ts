import { getSizes } from "./getSizes";

describe("getSizes", () => {
  test("returns the correct string when passed three widths (numbers only)", () => {
    const sizes = getSizes([200, 500, 700]);

    expect(sizes).toBe(
      "(min-width: 1280px) 700px, (min-width: 750px) 500px, 200px",
    );
  });
  test("returns the correct string when passed three widths (incl strings)", () => {
    const sizes = getSizes(["100vw", 500, 700]);

    expect(sizes).toBe(
      "(min-width: 1280px) 700px, (min-width: 750px) 500px, 100vw",
    );
  });
  test("returns the correct string when passed three widths", () => {
    const sizes = getSizes([200, 500, 700]);

    expect(sizes).toBe(
      "(min-width: 1280px) 700px, (min-width: 750px) 500px, 200px",
    );
  });
  test("returns the correct string when passed two widths", () => {
    const sizes = getSizes([200, 500]);

    expect(sizes).toBe("(min-width: 750px) 500px, 200px");
  });
  test("returns the correct string when passed one widths", () => {
    const sizes = getSizes([200]);

    expect(sizes).toBe("200px");
  });
  test("returns the correct string when passed none widths", () => {
    // eslint-disable-next-line
    // @ts-ignore
    const sizes = getSizes([]);
    expect(sizes).toBe("");
  });
  test("ignores extra values if more three values passed", () => {
    // eslint-disable-next-line
    // @ts-ignore
    const sizes = getSizes([200, 500, 700, 1000]);
    expect(sizes).toBe(
      "(min-width: 1280px) 700px, (min-width: 750px) 500px, 200px",
    );
    // eslint-disable-next-line
    // @ts-ignore
    const moreSizes = getSizes([200, 500, 700, 1000, 4000, 30]);
    expect(moreSizes).toBe(
      "(min-width: 1280px) 700px, (min-width: 750px) 500px, 200px",
    );
  });
});
