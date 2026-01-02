import { waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";

import CurriculumPreviousDownloadsPage from "@/pages/teachers/curriculum/previous-downloads";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

jest.mock("next/navigation");

(usePathname as jest.Mock).mockReturnValue("/");

const render = renderWithProviders();

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    query: { subject: "" },
    asPath: "",
    pathname: "/",
  }),
}));

describe("CurriculumPreviousDownloadsPage", () => {
  const renderComponent = () => {
    return render(<CurriculumPreviousDownloadsPage topNav={topNavFixture} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders the correct tab based on the location hash", async () => {
    window.location.hash = "#KS3";
    const { getByTestId } = renderComponent();
    await waitFor(async () => {
      const heading = getByTestId("heading2");
      expect(heading).toHaveTextContent("KS3");
    });
  });

  it("renders the heading and description", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("heading1")).toHaveTextContent(
      "Previously released curricula",
    );
    expect(getByTestId("description")).toBeInTheDocument();
  });

  it("renders the breadcrumbs", async () => {
    const { getByTestId } = renderComponent();
    await waitFor(async () => {
      const container = getByTestId("breadcrumbsContainer");
      const linkItems = container.querySelectorAll("li");
      expect(linkItems.length).toBe(3);
    });
  });

  it("renders the dropdown navigation for mobile", () => {
    const { getByTestId } = renderComponent();
    const dropdownNav = getByTestId("dropdownNav");
    expect(dropdownNav).toBeInTheDocument();
  });

  it("renders tab navigation for desktop", () => {
    const { getByTestId } = renderComponent();
    const tabularNav = getByTestId("tabularNav");
    expect(tabularNav).toBeInTheDocument();

    const tabItems = tabularNav.querySelectorAll("a");
    ["EYFS", "KS1", "KS2", "KS3", "KS4", "Specialist", "Therapies"].forEach(
      (key, index) => {
        expect(tabItems[index]).toHaveTextContent(key);
      },
    );
  });

  it("renders the downloadable curriculum document cards", async () => {
    const { getAllByTestId } = renderComponent();
    await waitFor(async () => {
      const cards = getAllByTestId("resourceCard");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  it("allows user to select a card and clears selection on navigation", async () => {
    const { getByTestId, getAllByTestId } = renderComponent();
    const card = getAllByTestId("resourceCard")[0];
    if (card === undefined) {
      throw new Error("No cards found");
    }
    await userEvent.click(card.querySelector("label")!);
    const input = card.querySelector("input") as HTMLInputElement;
    expect(input?.checked).toBeTruthy();
    const link =
      getAllByTestId("tabularNav")[0]?.querySelector('a[title="KS2"]');
    if (!link) {
      throw new Error("Link not found");
    }
    await userEvent.click(link);
    await waitFor(async () => {
      const heading = getByTestId("heading2");
      expect(heading).toHaveTextContent("KS2");
      expect(
        getByTestId("cardsContainer").querySelector("input:checked"),
      ).toBeNull();
    });
  });

  test("selects the correct tab based on URL params", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { keystage: "ks4" },
      asPath: "/some-path",
      pathname: "/",
    });
    const { getByTestId } = renderComponent();
    await waitFor(async () => {
      const heading = getByTestId("heading2");
      expect(heading).toHaveTextContent("KS4");
    });
  });
});
