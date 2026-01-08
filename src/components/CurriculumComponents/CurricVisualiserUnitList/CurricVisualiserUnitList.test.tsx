import { act } from "@testing-library/react";
import { usePathname } from "next/navigation";

import { basicFixtures } from "./CurricVisualiserUnitList.fixtures";

import { CurricVisualiserUnitList } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

jest.mock("next/navigation");

(usePathname as jest.Mock).mockReturnValue("/");

const unitOverviewAccessedMock = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      unitOverviewAccessed: (...args: []) => unitOverviewAccessedMock(...args),
    },
  }),
}));

describe("CurricVisualiserUnitList", () => {
  it("should display a list of units", async () => {
    const { baseElement, findAllByRole } = render(
      <CurricVisualiserUnitList {...basicFixtures} />,
    );

    const allLinks = await findAllByRole("link");
    expect(allLinks.length).toEqual(4);
    expect(allLinks[0]?.textContent).toEqual(expect.stringContaining("One"));
    expect(allLinks[1]?.textContent).toEqual(expect.stringContaining("Two"));
    expect(allLinks[2]?.textContent).toEqual(expect.stringContaining("Three"));
    expect(allLinks[3]?.textContent).toEqual(expect.stringContaining("Four"));
    expect(baseElement).toMatchSnapshot();
  });

  it("clicking should trigger analytics", async () => {
    const { findAllByRole } = render(
      <CurricVisualiserUnitList {...basicFixtures} />,
    );

    const allLinks = await findAllByRole("link");
    expect(allLinks[0]).toBeTruthy();
    act(() => {
      allLinks[0]?.click();
    });
    expect(unitOverviewAccessedMock).toHaveBeenCalledWith({
      analyticsUseCase: null,
      componentType: "unit_info_button",
      engagementIntent: "use",
      eventVersion: "2.0.0",
      isUnitPublished: false,
      platform: "owa",
      product: "curriculum visualiser",
      subjectSlug: "transfiguration",
      subjectTitle: "Transfiguration",
      threadSlug: null,
      threadTitle: null,
      unitHighlighted: false,
      unitName: "One",
      unitSlug: "one",
      yearGroupName: "Year 5",
      yearGroupSlug: "5",
    });
  });
});
