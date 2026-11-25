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
