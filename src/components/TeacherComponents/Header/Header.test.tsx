import { screen } from "@testing-library/dom";

import { Header } from "./Header";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const baseProps = {
  heading: "Music secondary",
  subject: "music" as const,
  subjectTitle: "Science",
  phaseTitle: "Secondary",
  summary: "Test content for the programme header.",
  bullets: ["Bullet 1", "Bullet 2"],
  heroImage: null,
};

describe("Header", () => {
  it("renders heading", () => {
    renderWithTheme(<Header {...baseProps} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Music secondary",
    );
  });
  it("renders summary text", () => {
    renderWithTheme(<Header {...baseProps} />);

    expect(
      screen.getByText("Test content for the programme header."),
    ).toBeInTheDocument();
  });

  describe("bullets rendering", () => {
    it("renders all bullet points", () => {
      renderWithTheme(<Header {...baseProps} />);
      const listItems = screen.getAllByRole("listitem");

      expect(listItems).toHaveLength(2);
      expect(listItems[0]).toHaveTextContent("Bullet 1");
      expect(listItems[1]).toHaveTextContent("Bullet 2");
    });

    it("renders bullets as list items", () => {
      renderWithTheme(<Header {...baseProps} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
    });

    it("does not render bullets list when bullets array is empty", () => {
      renderWithTheme(<Header {...baseProps} bullets={[]} />);
      const list = screen.queryByRole("list");

      expect(list).not.toBeInTheDocument();
    });

    it("does not render bullets list when bullets prop is undefined", () => {
      renderWithTheme(<Header {...baseProps} bullets={undefined} />);
      const list = screen.queryByRole("list");

      expect(list).not.toBeInTheDocument();
    });
  });

  describe("slots rendering", () => {
    it("renders header slot content when provided", () => {
      const headerContent = "Breadcrumb navigation";
      renderWithTheme(<Header {...baseProps} headerSlot={headerContent} />);

      expect(screen.getByText(headerContent)).toBeInTheDocument();
    });

    it("renders footer slot content when provided", () => {
      const footerContent = "Action buttons";
      renderWithTheme(<Header {...baseProps} footerSlot={footerContent} />);

      expect(screen.getByText(footerContent)).toBeInTheDocument();
    });
  });
});
