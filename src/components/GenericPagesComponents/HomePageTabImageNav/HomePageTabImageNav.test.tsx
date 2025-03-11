import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import HomePageTabImageNav from "./HomePageTabImageNav";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const productHomepageAccessed = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      productHomepageAccessed: (...args: unknown[]) =>
        productHomepageAccessed(...args),
    },
  }),
}));

describe("HomePageTabImageNav Component", () => {
  it("renders without errors", () => {
    const { container } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <HomePageTabImageNav current="teachers" />
      </OakThemeProvider>,
    );
    expect(container).toBeTruthy();
  });

  it.each([
    [/Curriculum Plans/i, "/curriculum"],
    [/AI experiments/i, "/ai"],
    [/Pupils/i, "/pupils"],
  ])(
    "navigates to the correct tab when the button is clicked",
    (name, path) => {
      //mock window.location
      Object.defineProperty(window, "location", {
        value: {
          href: "/",
        },
        writable: true,
      });

      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <HomePageTabImageNav current="teachers" />
        </OakThemeProvider>,
      );
      const curriculumButton = getByRole("link", {
        name,
      });
      expect(curriculumButton).toHaveAttribute("href", path);
    },
  );

  describe("productHomepageAccessed", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("sends a tracking event when curriculum tab is clicked", async () => {
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <HomePageTabImageNav current="teachers" />
        </OakThemeProvider>,
      );
      const curriculumButton = getByRole("link", {
        name: "Curriculum plans",
      });

      expect(curriculumButton).toBeInTheDocument();

      await act(async () => {
        await userEvent.click(curriculumButton);
      });

      expect(productHomepageAccessed).toHaveBeenCalledTimes(1);
      expect(productHomepageAccessed).toHaveBeenCalledWith({
        platform: "owa",
        analyticsUseCase: "Teacher",
        engagementIntent: "explore",
        eventVersion: "2.0.0",
        product: "curriculum visualiser",
        componentType: "homepage_tab",
      });
    });
    it("sends a tracking event when aila tab is clicked", async () => {
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <HomePageTabImageNav current="teachers" />
        </OakThemeProvider>,
      );
      const aiButton = getByRole("link", {
        name: /AI experiments/i,
      });

      await act(async () => {
        await userEvent.click(aiButton);
      });

      expect(productHomepageAccessed).toHaveBeenCalledTimes(1);
      expect(productHomepageAccessed).toHaveBeenCalledWith({
        platform: "owa",
        analyticsUseCase: "Teacher",
        engagementIntent: "explore",
        eventVersion: "2.0.0",
        product: "ai lesson assistant",
        componentType: "homepage_tab",
      });
    });
  });
});
