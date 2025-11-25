import { GetInvolvedWorkWithUs } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("GetInvolvedWorkWithUs", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <GetInvolvedWorkWithUs
        heading="Work with us"
        text={["TESTING_PARAGRAPH_1", "TESTING_PARAGRAPH_2"]}
        permanentRolesLink="https://example.com/permanent"
        freelanceRolesLink="https://example.com/freelance"
        imageUrl="http://example.com/team.jpg"
        imageAlt="Team working together"
        badges={[
          { url: "http://example.com/badge1.png", alt: "Badge 1" },
          { url: "http://example.com/badge2.png", alt: "Badge 2" },
          { url: "http://example.com/badge3.png", alt: "Badge 3" },
        ]}
      />,
    );
    expect(baseElement).toMatchSnapshot();

    expect(getByRole("heading", { level: 2 })).toHaveTextContent(
      "Work with us",
    );

    const paragraphs = getAllByRole("paragraph");
    expect(paragraphs[0]).toHaveTextContent("TESTING_PARAGRAPH_1");
    expect(paragraphs[1]).toHaveTextContent("TESTING_PARAGRAPH_2");

    const links = getAllByRole("link");
    expect(links[0]).toHaveTextContent("Permanent roles");
    expect(links[0]).toHaveAttribute("href", "https://example.com/permanent");
    expect(links[1]).toHaveTextContent("Freelance roles");
    expect(links[1]).toHaveAttribute("href", "https://example.com/freelance");
  });
});
