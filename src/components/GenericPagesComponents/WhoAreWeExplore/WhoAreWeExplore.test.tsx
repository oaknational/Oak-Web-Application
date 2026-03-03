import { WhoAreWeExplore } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

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
          },
          {
            iconName: "search",
            title: "ITEM_TWO",
            href: "#item_two",
          },
          {
            iconName: "search",
            title: "ITEM_THREE",
            href: "#item_three",
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
});
