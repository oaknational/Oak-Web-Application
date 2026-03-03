import { CurriculumPartners } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurriculumPartners", () => {
  it("renders correctly", () => {
    const items = new Array(10).fill(true).map((_, index) => {
      return {
        imageUrl: `/images/oak-national-academy-logo-512.png#${index}`,
        alt: `item ${index}`,
      };
    });

    const { baseElement, getByRole, getAllByRole } = render(
      <CurriculumPartners
        title={"TEST_TITLE"}
        text={"TEST_TEXT"}
        items={items}
      />,
    );
    expect(baseElement).toMatchSnapshot();

    const headings = getAllByRole("heading", { level: 3 });
    expect(headings[0]).toHaveTextContent("TEST_TITLE");

    const paragraph = getByRole("paragraph");
    expect(paragraph).toHaveTextContent("TEST_TEXT");

    const images = getAllByRole("img");
    expect(images.length).toEqual(items.length);
  });
});
