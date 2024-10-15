export function findContainingAnchor(root: Element) {
  let node: null | Element = root;
  while (node && node.tagName !== "A" && node.parentNode) {
    node = node.parentElement;
  }
  if (node instanceof HTMLAnchorElement) {
    return node;
  }
}
