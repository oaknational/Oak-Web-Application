import { fireEvent } from "@testing-library/react";
import { GetInvolvedWorkWithUs } from "./";

import { aboutUsContactInitiated } from "@/browser-lib/avo/Avo";
import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

jest.mock("@/browser-lib/avo/Avo", () => ({
  ...jest.requireActual("@/browser-lib/avo/Avo"),
  aboutUsContactInitiated: jest.fn(),
}));

describe("GetInvolvedWorkWithUs", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <GetInvolvedWorkWithUs
        heading="Work with us"
        text={portableTextFromString("TESTING_PARAGRAPH_1")}
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

    const links = getAllByRole("link");
    expect(links[0]).toHaveTextContent("Permanent roles");
    expect(links[0]).toHaveAttribute("href", "https://example.com/permanent");
    expect(links[1]).toHaveTextContent("Freelance roles");
    expect(links[1]).toHaveAttribute("href", "https://example.com/freelance");
  });

  it("should call aboutUsContactInitiated with the correct analytics object when 'Permanent roles' clicked", () => {
    const { getByRole } = render(
      <GetInvolvedWorkWithUs
        heading="Work with us"
        text={portableTextFromString("TESTING_PARAGRAPH_1")}
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

    const link = getByRole("link", { name: /permanent roles/i });
    fireEvent.click(link);

    expect(aboutUsContactInitiated).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "permanent_roles",
      }),
    );
  });

  it("should call aboutUsContactInitiated with the correct analytics object when 'Freelance roles' clicked", () => {
    const { getByRole } = render(
      <GetInvolvedWorkWithUs
        heading="Work with us"
        text={portableTextFromString("TESTING_PARAGRAPH_1")}
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

    const link = getByRole("link", { name: /freelance roles/i });
    fireEvent.click(link);

    expect(aboutUsContactInitiated).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "freelance_roles",
      }),
    );
  });
});
