import { screen } from "@testing-library/react";

import { TeachWithOakPromoSection } from "./TeachWithOakPromoSection";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);
const query = {
  returnTo: "/test/url",
  lessonName: "Lesson Name",
  unitName: "Unit Name",
};

describe("TeachWithOakPromoSection", () => {
  it("renders correctly", () => {
    const { container, getByText } = render(
      <TeachWithOakPromoSection {...query} />,
    );
    expect(container).toMatchSnapshot();
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Ever wondered why our lessons are structured this way?",
    });

    expect(heading).toBeInTheDocument();

    expect(
      getByText("Ever wondered why our lessons are structured this way?"),
    ).toBeInTheDocument();
    expect(
      getByText(
        "See how explanation, checks for understanding, practice and feedback work together to support pupils' learning.",
      ),
    ).toBeInTheDocument();
    expect(getByText("See the thinking")).toBeInTheDocument();
  });

  it("renders link pointing to the correct href", () => {
    render(<TeachWithOakPromoSection {...query} />);

    const link = screen.getByRole("link", { name: /See the thinking/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "/teachers/teach-with-oak?returnTo=%2Ftest%2Furl&lessonName=Lesson+Name&unitName=Unit+Name",
    );
  });
});
