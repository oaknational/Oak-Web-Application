import { getByRole } from "@testing-library/dom";

import { WhoAreWeDesc } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("WhoAreWeDesc", () => {
  it("renders correctly", () => {
    const items = new Array(4).fill(true).map((_item, index) => {
      return {
        title: `ITEM_TITLE_${index}`,
        text: `ITEM_TEXT_${index}`,
        image: {
          asset: {
            url: `http://example.com/${index}`,
          },
          altText: `ITEM_ALT_${index}`,
        },
      };
    });

    const { baseElement, getAllByRole, getAllByTestId } = render(
      <WhoAreWeDesc title={"TESTING_TITLE"} items={items} />,
    );

    expect(getAllByRole("heading")[0]).toHaveTextContent("TESTING_TITLE");
    const itemElements = getAllByTestId("who-we-are-desc-item");
    expect(itemElements).toHaveLength(items.length);

    items.forEach((item, index) => {
      expect(getByRole(itemElements[index]!, "img")).toHaveAttribute(
        "src",
        `http://localhost/_next/image?url=${encodeURIComponent(item.image.asset.url)}&w=3840&q=75`,
      );
      expect(getByRole(itemElements[index]!, "img")).toHaveAttribute(
        "alt",
        item.image.altText,
      );
      expect(getByRole(itemElements[index]!, "heading")).toHaveTextContent(
        item.title,
      );
      expect(itemElements[index]!).toHaveTextContent(item.text);
    });

    expect(baseElement).toMatchSnapshot();
  });
});
