import { CurriculumPartners } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { portableTextFromString } from "@/__tests__/__helpers__/cms";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurriculumPartners", () => {
  it("renders correctly for current partners", () => {
    const items = new Array(10).fill(true).map((_, index) => {
      return {
        imageUrl: `/images/oak-national-academy-logo-512.png#${index}`,
        alt: `item ${index}`,
      };
    });

    const { baseElement, getByRole, getAllByRole, queryByRole } = render(
      <CurriculumPartners
        title={"Current"}
        text={portableTextFromString("TEST_TEXT")}
        items={items}
      />,
    );

    expect(baseElement).toMatchSnapshot();

    const heading = queryByRole("heading", { name: "Current", level: 3 });
    expect(heading).toBeInTheDocument();

    const paragraph = getByRole("paragraph");
    expect(paragraph).toHaveTextContent("TEST_TEXT");

    const images = getAllByRole("img");
    expect(images).toHaveLength(items.length);
  });

  it("renders correctly for legacy partners", () => {
    const items = new Array(6).fill(true).map((_, index) => {
      return {
        imageUrl: `/images/oak-national-academy-logo-512.png#${index}`,
        alt: `item ${index}`,
      };
    });

    const { baseElement, getByRole, getAllByRole, queryByRole } = render(
      <CurriculumPartners
        title={"Legacy"}
        text={portableTextFromString("TEST_TEXT")}
        items={items}
      />,
    );

    expect(baseElement).toMatchSnapshot();

    const heading = queryByRole("heading", { name: "Legacy", level: 3 });
    expect(heading).toBeInTheDocument();

    const paragraph = getByRole("paragraph");
    expect(paragraph).toHaveTextContent("TEST_TEXT");

    const images = getAllByRole("img");
    expect(images).toHaveLength(items.length);
  });
});
