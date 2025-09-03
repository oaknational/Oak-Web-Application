export const mockLinkClick = jest.fn();

function handler(e: MouseEvent) {
  if (e.target instanceof HTMLElement) {
    const origin = e.target.closest(`a`);
    if (origin) {
      mockLinkClick(origin.href);
      e.preventDefault();
    }
  }
}

export function setupMockLinkClick() {
  document.addEventListener("click", handler, true);
}

export function teardownMockLinkClick() {
  document.removeEventListener("click", handler, true);
}
