let installed = false;

/**
 * In a sandboxed iframe that lacks the `allow-presentation` flag (e.g. the
 * Google Classroom add-on frame), constructing a `PresentationRequest` throws a
 * `SecurityError`. The Mux player initialises Google Cast on mount, which
 * constructs one — and because that happens inside a React effect it escalates
 * to the error boundary and crashes the whole page.
 *
 * Cast / Remote Playback can never function in such a frame anyway, so this
 * replaces `PresentationRequest` with an inert stub whose construction does not
 * throw and which reports no available presentation displays.
 *
 * It self-gates: it probes the native constructor and only patches when that
 * construction throws, so normal (non-sandboxed) browsing keeps the real Cast /
 * AirPlay support untouched. Safe and idempotent to call on every render.
 *
 * This was setup to deal with Issue 7 here:
 * https://www.notion.so/oaknationalacademy/Add-static-pupil-section-pages-legacy-experience-33b26cc4e1b1808884f7dc2a7987a674
 */
export const installPresentationRequestIframeGuard = (): void => {
  if (installed || !globalThis.window) return;
  installed = true;

  const globalWithPresentation =
    globalThis.window as typeof globalThis.window & {
      PresentationRequest?: new (...args: unknown[]) => unknown;
    };
  const NativePresentationRequest = globalWithPresentation.PresentationRequest;
  if (!NativePresentationRequest) return;

  try {
    new NativePresentationRequest("#");
    // Construction succeeded — not sandboxed, leave the native API alone.
    return;
  } catch {
    // Sandboxed without allow-presentation: fall through and install the stub.
  }

  const rejectNotAllowedError = () =>
    Promise.reject(
      new DOMException(
        "Presentation is not available in this context.",
        "NotAllowedError",
      ),
    );

  class InertPresentationRequest extends EventTarget {
    constructor(_urls?: string | string[]) {
      super();
    }
    start() {
      return rejectNotAllowedError();
    }
    reconnect() {
      return rejectNotAllowedError();
    }
    getAvailability() {
      return Promise.resolve({
        value: false,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      });
    }
  }

  globalWithPresentation.PresentationRequest =
    InertPresentationRequest as unknown as new (...args: unknown[]) => unknown;

  // The Cast SDK follows construction with
  // `navigator.presentation.defaultRequest = new PresentationRequest(...)`.
  // The native `Presentation.defaultRequest` setter brand-checks its value and
  // throws a `TypeError` on our stub instance, so swallow the assignment too.
  const presentation = (navigator as Navigator & { presentation?: object })
    .presentation;
  if (presentation) {
    try {
      Object.defineProperty(presentation, "defaultRequest", {
        configurable: true,
        get() {
          return null;
        },
        set() {
          /* no-op: presentation displays are unavailable in this frame */
        },
      });
    } catch {
      // If the property can't be redefined, the stub alone still prevents the
      // original SecurityError; nothing more we can safely do here.
    }
  }
};
