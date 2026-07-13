import { SupportYou } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("SupportYou", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(<SupportYou />);
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent(
      "Discover how Oak can support you",
    );
    expect(getByRole("paragraph")).toHaveTextContent(
      "To explore the impact Oak’s curricula could have in your school or trust, fill out the form below and one of our experts will be in touch shortly.",
    );
    expect(getByRole("link")).toHaveTextContent("Get in touch with an expert");
  });
});
