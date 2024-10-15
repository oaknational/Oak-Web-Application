import { anchorIntersectionObserver, createNode , findContainingAnchor } from "./dom";

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
