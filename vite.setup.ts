import { TextEncoder, TextDecoder } from "node:util";

import "@testing-library/jest-dom";
import { vi } from "vitest";
import "whatwg-fetch";

// TextEncoder and TextDecoder are Web APIs but not available in JSDOM
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// JSDOM does not implement SubmitEvent
global.SubmitEvent =
  global.SubmitEvent ||
  class MockSubmitEvent extends Event {
    constructor(name, options) {
      super(name, options);
      this.submitter = options?.submitter ?? null;
    }
  };

vi.mock("next/font/google", () => ({
  Lexend: () => ({
    style: {
      fontFamily: "mock",
    },
  }),
}));

vi.mock("react", async () => ({
  ...(await vi.importActual("react")),
  useId: () => "react-use-id-test-result",
}));

vi.mock("next/router", () => require("next-router-mock"));

vi.mock("@clerk/nextjs", async () => {
  return {
    ...(await vi.importActual("./__mocks__/@clerk/nextjs")),
  };
});

vi.mock("better-react-mathjax", () => ({
  MathJax: ({ children }: { children: React.ReactNode }) => children,
  MathJaxContext: ({ children }: { children: React.ReactNode }) => children,
}));
