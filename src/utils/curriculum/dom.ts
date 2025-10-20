export function createNode(
  nodeName: string,
  attributes: Record<string, string> = {},
) {
  const node = document.createElement(nodeName);
  for (const [attributeName, attributeValue] of Object.entries(attributes)) {
    node.setAttribute(attributeName, attributeValue);
  }
  return node;
}

export function anchorIntersectionObserver(callback: (id: string) => void) {
  const visibleAnchors = new Map();

  return (
    entries: Pick<
      IntersectionObserverEntry,
      "boundingClientRect" | "target" | "isIntersecting"
    >[],
  ) => {
    entries.forEach((entry) => {
      const top = entry.boundingClientRect.top;
      const year = entry.target.id;
      if (entry.isIntersecting) {
        visibleAnchors.set(year, top);
      } else {
        visibleAnchors.delete(year);
      }
      if (visibleAnchors.size > 0) {
        const sortedAnchors = Array.from(visibleAnchors.entries()).sort(
          ([, aTop], [, bTop]) => aTop - bTop,
        );
        callback(sortedAnchors[0]?.[0]);
      }
    });
  };
}

export function findContainingAnchor(root: Element) {
  let node: null | Element = root;
  while (node && node.tagName !== "A" && node.parentNode) {
    node = node.parentElement;
  }
  if (node instanceof HTMLAnchorElement) {
    return node;
  }
}

export function getAllTabFocusableElements(
  root?: HTMLElement | null,
): HTMLElement[] {
  if (root) {
    const selector =
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
    // <https://zellwk.com/blog/keyboard-focusable-elements/>
    return [...root.querySelectorAll(selector)] as HTMLElement[];
  }
  return [];
}

export function findParentNode(target: Element, fn: (el: Element) => boolean) {
  let curr: ParentNode | null = target;
  while ((curr = curr.parentNode)) {
    if (curr && fn(curr as Element)) {
      return curr as Element;
    }
  }
}

export function findAccosiatedLabel(root: Element, target: Element) {
  const parentLabelElement = findParentNode(
    target,
    (el: Element) => el.tagName === "LABEL",
  );
  return parentLabelElement ?? root.querySelector(`label[for="${target.id}"]`);
}
