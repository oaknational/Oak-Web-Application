import { findContainingAnchor, getAllTabFocusableElements } from "./dom";

// Polyfill for domRectFromRect(...)
export function domRectFromRect({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return {
    x,
    y,
    width,
    height,
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
  } as DOMRect;
}

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("findContainingAnchor", () => {
  let root: HTMLElement;
  beforeAll(() => {
    root = document.createElement("div");
    root.innerHTML = `
            <p>test</p>
            <p>
                <a id="direct" data-testid="DIRECT">direct</a>
            </p>
            <p data-testid="MISSING">test</p>
            <p>
                <a id="as-parent">
                    <span data-testid="AS_PARENT">as parent</span>
                </a>
            </p>
        `;
  });
  it("direct", () => {
    const target = root.querySelector(`*[data-testid="DIRECT"]`)!;
    const el = findContainingAnchor(target);
    expect(el).toBeTruthy();
    expect(el?.id).toBe("direct");
  });

  it("as parent", () => {
    const target = root.querySelector(`*[data-testid="AS_PARENT"]`)!;
    const el = findContainingAnchor(target);
    expect(el).toBeTruthy();
    expect(el?.id).toBe("as-parent");
  });

  it("missing", () => {
    const target = root.querySelector(`*[data-testid="MISSING"]`)!;
    const el = findContainingAnchor(target);
    expect(el).toBeUndefined();
  });
});

describe("getAllTabFocusableElements()", () => {
  it("should fetch all focusable elements", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div>
        <a href="">hello</a>
        <button></button>
        <span></span>
        <input/>
        foo
        <textarea></textarea>
        <select></select>
        <details></details>
        <div tabindex="0"></div>
        <img/>
        testing
      </div>
    `;
    const elements = getAllTabFocusableElements(root).map((el) => el.tagName);
    expect(elements).toEqual([
      "A",
      "BUTTON",
      "INPUT",
      "TEXTAREA",
      "SELECT",
      "DETAILS",
      "DIV",
    ]);
  });

  it("should be empty if none present", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div>
        <span></span>
        foo
        <img/>
        testing
      </div>
    `;
    const elements = getAllTabFocusableElements(root).map((el) => el.tagName);
    expect(elements).toEqual([]);
  });

  it("should be empty if no root element supplied", () => {
    const elements = getAllTabFocusableElements(null);
    expect(elements).toEqual([]);
  });
});
