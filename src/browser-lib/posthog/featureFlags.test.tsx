import { act, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import {
  useFeatureFlagEnabled as usePostHogFeatureFlagEnabled,
  useFeatureFlagVariantKey as usePostHogFeatureFlagVariantKey,
} from "posthog-js/react";

import {
  useFeatureFlagEnabled,
  useFeatureFlagVariantKey,
} from "./featureFlags";

jest.mock("react-dom/server", () =>
  jest.requireActual("react-dom/server.node"),
);

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn(),
  useFeatureFlagVariantKey: jest.fn(),
}));

const mockEnabled = jest.mocked(usePostHogFeatureFlagEnabled);
const mockVariant = jest.mocked(usePostHogFeatureFlagVariantKey);

function FlagConsumer() {
  const enabled = useFeatureFlagEnabled("heatwave-banner");
  const variant = useFeatureFlagVariantKey("teachers-teach-with-oak");

  return (
    <div>
      <span data-testid="enabled">{String(enabled)}</span>
      <span data-testid="variant">{String(variant)}</span>
    </div>
  );
}

describe("hydration-safe feature flags", () => {
  beforeEach(() => {
    mockEnabled.mockReturnValue(true);
    mockVariant.mockReturnValue("promo-section");
  });

  it("returns unevaluated flags during server rendering even with cached values", () => {
    expect(renderToString(<FlagConsumer />)).toBe(
      '<div><span data-testid="enabled">undefined</span><span data-testid="variant">undefined</span></div>',
    );
  });

  it("hydrates without a mismatch when flags differ from the server", async () => {
    mockEnabled.mockReturnValue(false);
    mockVariant.mockReturnValue(undefined);
    const container = document.createElement("div");
    container.innerHTML = renderToString(<FlagConsumer />);
    mockEnabled.mockReturnValue(true);
    mockVariant.mockReturnValue("promo-section");
    const onRecoverableError = jest.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    try {
      await act(async () => {
        root = hydrateRoot(container, <FlagConsumer />, { onRecoverableError });
      });

      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(
        container.querySelector('[data-testid="enabled"]'),
      ).toHaveTextContent("true");
      expect(
        container.querySelector('[data-testid="variant"]'),
      ).toHaveTextContent("promo-section");
    } finally {
      await act(async () => root?.unmount());
    }
  });

  it("keeps exposing live flag values after hydration", () => {
    const { rerender } = render(<FlagConsumer />);
    expect(screen.getByTestId("enabled")).toHaveTextContent("true");
    expect(screen.getByTestId("variant")).toHaveTextContent("promo-section");

    mockEnabled.mockReturnValue(false);
    mockVariant.mockReturnValue("control");
    rerender(<FlagConsumer />);

    expect(screen.getByTestId("enabled")).toHaveTextContent("false");
    expect(screen.getByTestId("variant")).toHaveTextContent("control");
  });
});
