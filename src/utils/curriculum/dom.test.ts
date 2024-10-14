import { findContainingAnchor } from "./dom";

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
    expect(el);
    expect(el?.id).toBe("direct");
  });

  it("as parent", () => {
    const target = root.querySelector(`*[data-testid="AS_PARENT"]`)!;
    const el = findContainingAnchor(target);
    expect(el);
    expect(el?.id).toBe("as-parent");
  });

  it("missing", () => {
    const target = root.querySelector(`*[data-testid="MISSING"]`)!;
    const el = findContainingAnchor(target);
    expect(el).toBeUndefined();
  });
});
