import {
  anchorIntersectionObserver,
  createNode,
  findAccosiatedLabel,
  findContainingAnchor,
  findParentNode,
  getAllTabFocusableElements,
} from "./dom";

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

describe("createNode", () => {
  it("basic", () => {
    const node = createNode("span");
    expect(node.nodeName).toEqual("SPAN");
  });

  it("with attributes", () => {
    const node = createNode("span", { id: "test" });
    expect(node.nodeName).toEqual("SPAN");
    expect(node.id).toEqual("test");
  });
});

describe("anchorIntersectionObserver", () => {
  it("when no entries does nothing", () => {
    const onSelectMock = jest.fn();
    const callback = anchorIntersectionObserver(onSelectMock);
    callback([]);
    expect(onSelectMock).not.toHaveBeenCalled();
  });

  it("selects top entry of multiple", () => {
    const onSelectMock = jest.fn();
    const callback = anchorIntersectionObserver(onSelectMock);
    callback([
      {
        target: createNode("div", { id: "one" }),
        isIntersecting: true,
        boundingClientRect: domRectFromRect({
          x: 0,
          y: 100,
          width: 100,
          height: 100,
        }),
      },
      {
        target: createNode("div", { id: "two" }),
        isIntersecting: true,
        boundingClientRect: domRectFromRect({
          x: 0,
          y: 200,
          width: 100,
          height: 100,
        }),
      },
      {
        target: createNode("div", { id: "three" }),
        isIntersecting: true,
        boundingClientRect: domRectFromRect({
          x: 0,
          y: 300,
          width: 100,
          height: 100,
        }),
      },
    ]);
    expect(onSelectMock).toHaveBeenCalledWith("one");

    callback([
      {
        target: createNode("div", { id: "one" }),
        isIntersecting: false,
        boundingClientRect: domRectFromRect({
          x: 0,
          y: -100,
          width: 100,
          height: 100,
        }),
      },
      {
        target: createNode("div", { id: "two" }),
        isIntersecting: true,
        boundingClientRect: domRectFromRect({
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        }),
      },
      {
        target: createNode("div", { id: "three" }),
        isIntersecting: true,
        boundingClientRect: domRectFromRect({
          x: 0,
          y: 100,
          width: 100,
          height: 100,
        }),
      },
    ]);
    expect(onSelectMock).toHaveBeenCalledWith("two");
  });
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

describe("findParentNode", () => {
  it("should find parent node", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div>
        <label id="HERE">
          <div>
            <input />
          </div>
        </label>
      </div>
    `;
    const el = findParentNode(root.querySelector("input")!, (el) => {
      return el.tagName === "LABEL";
    });
    expect(el).toBeDefined();
    expect(el?.getAttribute("id")).toEqual("HERE");
  });

  it("return undefined if not found", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div>
        <div>
          <input />
        </div>
      </div>
    `;
    const el = findParentNode(root.querySelector("input")!, (el) => {
      return el.tagName === "LABEL";
    });
    expect(el).toBeUndefined();
  });
});

describe("findAccosiatedLabel", () => {
  it("with parent", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div>
        <label id="HERE">
          <div>
            <input />
          </div>
        </label>
      </div>
    `;
    const el = findAccosiatedLabel(root, root.querySelector("input")!);
    expect(el).toBeDefined();
    expect(el?.getAttribute("id")).toEqual("HERE");
  });

  it("with 'for'", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div>
        <label id="HERE" for="TARGET">
          <div>
          </div>
        </label>
        <input id="TARGET" />
      </div>
    `;
    const el = findAccosiatedLabel(root, root.querySelector("input")!);
    expect(el).toBeDefined();
    expect(el?.getAttribute("id")).toEqual("HERE");
  });

  it("when not present", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div>
        <label id="HERE">
          <div>
          </div>
        </label>
        <input id="TARGET" />
      </div>
    `;
    const el = findAccosiatedLabel(root, root.querySelector("input")!);
    expect(el).toBeNull();
  });
});
