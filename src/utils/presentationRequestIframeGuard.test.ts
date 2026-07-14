/**
 * @jest-environment jsdom
 */

type PresentationCtor = new (...args: unknown[]) => unknown;

// Load a fresh copy of the module for each test so its internal `installed`
// flag doesn't leak between cases.
const loadGuard = (): (() => void) => {
  let install: (() => void) | undefined;
  jest.isolateModules(() => {
    install =
      require("./presentationRequestIframeGuard").installPresentationRequestIframeGuard;
  });
  if (!install) throw new Error("failed to load guard");
  return install;
};

const win = window as typeof window & {
  PresentationRequest?: PresentationCtor;
};

describe("installPresentationRequestIframeGuard", () => {
  const originalPresentationRequest = win.PresentationRequest;
  const originalPresentationDescriptor = Object.getOwnPropertyDescriptor(
    navigator,
    "presentation",
  );

  afterEach(() => {
    if (originalPresentationRequest === undefined) {
      delete win.PresentationRequest;
    } else {
      win.PresentationRequest = originalPresentationRequest;
    }
    if (originalPresentationDescriptor) {
      Object.defineProperty(
        navigator,
        "presentation",
        originalPresentationDescriptor,
      );
    } else {
      // @ts-expect-error - cleaning up the property we defined for the test
      delete navigator.presentation;
    }
  });

  it("is a no-op when PresentationRequest is unavailable", () => {
    delete win.PresentationRequest;
    expect(() => loadGuard()()).not.toThrow();
    expect(win.PresentationRequest).toBeUndefined();
  });

  it("leaves the native constructor untouched when construction succeeds", () => {
    class WorkingPresentationRequest {
      constructor(_urls?: string | string[]) {}
    }
    win.PresentationRequest = WorkingPresentationRequest as PresentationCtor;

    loadGuard()();

    expect(win.PresentationRequest).toBe(WorkingPresentationRequest);
  });

  it("replaces the constructor with an inert stub when construction throws (sandboxed)", async () => {
    class ThrowingPresentationRequest {
      constructor() {
        throw new DOMException(
          "The document is sandboxed and lacks the 'allow-presentation' flag.",
          "SecurityError",
        );
      }
    }
    win.PresentationRequest = ThrowingPresentationRequest as PresentationCtor;

    loadGuard()();

    // The constructor must have been swapped out...
    expect(win.PresentationRequest).not.toBe(ThrowingPresentationRequest);
    // ...and constructing the stub must not throw.
    let instance: unknown;
    expect(() => {
      instance = new win.PresentationRequest!("cast://x");
    }).not.toThrow();

    const stub = instance as {
      start: () => Promise<unknown>;
      getAvailability: () => Promise<{ value: boolean }>;
    };
    await expect(stub.start()).rejects.toBeInstanceOf(DOMException);
    await expect(stub.getAvailability()).resolves.toMatchObject({
      value: false,
    });
  });

  it("swallows assignment to navigator.presentation.defaultRequest when sandboxed", () => {
    class ThrowingPresentationRequest {
      constructor() {
        throw new DOMException("sandboxed", "SecurityError");
      }
    }
    win.PresentationRequest = ThrowingPresentationRequest as PresentationCtor;

    // Mimic the native Presentation object whose defaultRequest setter
    // brand-checks its value and throws on anything that isn't a real
    // PresentationRequest.
    const presentation = {};
    Object.defineProperty(presentation, "defaultRequest", {
      configurable: true,
      set() {
        throw new TypeError(
          "Failed to set the 'defaultRequest' property on 'Presentation'.",
        );
      },
      get() {
        return undefined;
      },
    });
    Object.defineProperty(navigator, "presentation", {
      configurable: true,
      value: presentation,
    });

    loadGuard()();

    const nav = navigator as Navigator & {
      presentation: { defaultRequest: unknown };
    };
    expect(() => {
      nav.presentation.defaultRequest = new win.PresentationRequest!("x");
    }).not.toThrow();
    expect(nav.presentation.defaultRequest).toBeNull();
  });

  it("only patches once across repeated calls", () => {
    class ThrowingPresentationRequest {
      constructor() {
        throw new DOMException("sandboxed", "SecurityError");
      }
    }
    win.PresentationRequest = ThrowingPresentationRequest as PresentationCtor;

    const install = loadGuard();
    install();
    const afterFirst = win.PresentationRequest;
    install();
    // Second call is a no-op: the stub from the first call is still in place.
    expect(win.PresentationRequest).toBe(afterFirst);
  });
});
