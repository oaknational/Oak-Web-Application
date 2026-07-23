import { getByRole } from "@testing-library/dom";

import { WhoAreWeDesc } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { portableTextFromString } from "@/__tests__/__helpers__/cms";

const render = renderWithProvidersByName(["oakTheme"]);

describe("WhoAreWeDesc", () => {
  it("renders correctly", () => {
    const items = new Array(4).fill(true).map((_item, index) => {
      return {
        heading: `ITEM_TITLE_${index}`,
        textRaw: portableTextFromString(`ITEM_TEXT_${index}`),
        image: {
          asset: {
            _id: `image-${index}-300x300-png`,
            url: `https://cdn.sanity.io/images/p/d/${index}-300x300.png`,
          },
          altText: `ITEM_ALT_${index}`,
        },
      };
    });

    const { baseElement, getAllByRole, getAllByTestId } = render(
      <WhoAreWeDesc title={"TESTING_TITLE"} items={items} />,
    );
    expect(baseElement).toMatchSnapshot();

    expect(getAllByRole("heading")[0]).toHaveTextContent("TESTING_TITLE");
    const itemElements = getAllByTestId("who-we-are-desc-item");
    expect(itemElements).toHaveLength(items.length);

    items.forEach((item, index) => {
      expect(getByRole(itemElements[index]!, "img")).toHaveAttribute(
        "alt",
        item.image.altText,
      );
      expect(getByRole(itemElements[index]!, "heading")).toHaveTextContent(
        item.heading,
      );
      expect(itemElements[index]!).toHaveTextContent(`ITEM_TEXT_${index}`);
    });
  });
});
