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
            _id: `image-${index}-300x300-png`,
            url: `http://example.com/${index}-300x300-png`,
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
        `https://NEXT_PUBLIC_SANITY_ASSET_CDN_HOST/images/NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET/${index}-300x300.png?w=640&h=640&fm=webp&q=80&fit=clip&auto=format`,
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
