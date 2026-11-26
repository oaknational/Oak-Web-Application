import { basic as fixture } from "./FaqsSection.fixtures";

import FaqsSection from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("FaqsSection", () => {
  test("it renders correct data", () => {
    const { baseElement, getByRole } = render(<FaqsSection {...fixture} />);

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 2 })).toHaveTextContent(
      "Frequently asked questions",
    );
  });
});
