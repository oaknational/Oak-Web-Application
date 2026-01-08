import { screen } from "@testing-library/dom";
import { OakBox } from "@oaknational/oak-components";
import { ReactNode } from "react";

import CoreLayout from "./layout";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import { OakNotificationsProvider } from "@/context/OakNotifications/OakNotificationsProvider";
import OakError from "@/errors/OakError";

const mockTopNav = jest.fn().mockResolvedValue(topNavFixture);
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => mockTopNav(),
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const CoreLayoutWithProviders = async ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <OakNotificationsProvider>
      {await CoreLayout({ children })}
    </OakNotificationsProvider>
  );
};

describe("core layout", () => {
  it("renders a topnav", async () => {
    renderWithTheme(
      await CoreLayoutWithProviders({ children: <OakBox>children</OakBox> }),
    );
    const header = screen.getByTestId("app-topnav");
    expect(header).toBeInTheDocument();
  });
  it("renders children", async () => {
    renderWithTheme(
      await CoreLayoutWithProviders({ children: <OakBox>children</OakBox> }),
    );
    const children = screen.getByText("children");
    expect(children).toBeInTheDocument();
  });
  it("returns not found on error", async () => {
    mockTopNav.mockRejectedValueOnce(
      new OakError({ code: "curriculum-api/not-found" }),
    );
    expect(async () =>
      renderWithTheme(
        await CoreLayoutWithProviders({
          children: <OakBox>children</OakBox>,
        }),
      ),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
