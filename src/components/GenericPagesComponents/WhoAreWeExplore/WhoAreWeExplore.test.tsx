import { fireEvent } from "@testing-library/react";
import { aboutUsExplored } from "@/browser-lib/avo/Avo";
import { WhoAreWeExplore } from "./";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

jest.mock("@/browser-lib/avo/Avo", () => ({
  ...jest.requireActual("@/browser-lib/avo/Avo"),
  aboutUsExplored: jest.fn(),
}));

describe("WhoAreWeExplore", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <WhoAreWeExplore
        title={"TEST_TITLE"}
        items={[
          {
            iconName: "search",
            title: "ITEM_ONE",
            href: "#item_one",
            componentType: "about_oak",
          },
          {
            iconName: "search",
            title: "ITEM_TWO",
            href: "#item_two",
            componentType: "get_involved",
          },
          {
            iconName: "search",
            title: "ITEM_THREE",
            href: "#item_three",
            componentType: "meet_the_team",
          },
        ]}
      />,
    );

    expect(getByRole("heading")).toHaveTextContent("TEST_TITLE");

    const elements = getAllByRole("link");
    expect(elements.length).toEqual(3);

    expect(elements[0]).toHaveTextContent("ITEM_ONE");
    expect(elements[0]).toHaveAttribute("href", "#item_one");
    expect(elements[1]).toHaveTextContent("ITEM_TWO");
    expect(elements[1]).toHaveAttribute("href", "#item_two");
    expect(elements[2]).toHaveTextContent("ITEM_THREE");
    expect(elements[2]).toHaveAttribute("href", "#item_three");
    expect(baseElement).toMatchSnapshot();
  });

  it("should call aboutUsExplored with the correct analytics object when an item is clicked", () => {
    const { getByRole } = render(
      <WhoAreWeExplore
        title={"TEST_TITLE"}
        items={[
          {
            iconName: "search",
            title: "ITEM_ONE",
            href: "#item_one",
            componentType: "about_oak",
          },
        ]}
      />,
    );

    const link = getByRole("link", { name: "ITEM_ONE" });
    fireEvent.click(link);

    expect(aboutUsExplored).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "about_oak",
      }),
    );
  });
});
