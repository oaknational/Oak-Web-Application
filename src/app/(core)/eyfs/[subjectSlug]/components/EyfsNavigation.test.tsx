import { screen } from "@testing-library/react";

import { EYFSNavigation, pickSubjectTitle } from "./EyfsNavigation";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

const mockUseParams = jest.fn();
jest.mock("next/navigation", () => ({
  useParams: () => mockUseParams(),
}));

const subjectTabs = [
  { slug: "maths", title: "Maths" },
  {
    slug: "personal-social-and-emotional-development",
    title: "Personal, social and emotional development",
  },
  { slug: "literacy", title: "Literacy" },
];

describe("pickSubjectTitle", () => {
  it("returns PSED for personal-social-and-emotional-development slug", () => {
    expect(
      pickSubjectTitle({
        slug: "personal-social-and-emotional-development",
        title: "Personal, social and emotional development",
      }),
    ).toBe("PSED");
  });

  it("returns subject title for other slugs", () => {
    expect(pickSubjectTitle({ slug: "maths", title: "Maths" })).toBe("Maths");
  });
});

describe("EYFSNavigation", () => {
  it("renders a link for each subject tab", () => {
    mockUseParams.mockReturnValue({ subjectSlug: "maths" });
    render(<EYFSNavigation subjectTabs={subjectTabs} />);

    expect(screen.getByRole("link", { name: "Maths" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "PSED" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Literacy" })).toBeInTheDocument();
  });

  it("renders links with correct hrefs", () => {
    mockUseParams.mockReturnValue({ subjectSlug: "maths" });
    render(<EYFSNavigation subjectTabs={subjectTabs} />);

    expect(screen.getByRole("link", { name: "Maths" })).toHaveAttribute(
      "href",
      "/eyfs/maths",
    );
    expect(screen.getByRole("link", { name: "PSED" })).toHaveAttribute(
      "href",
      "/eyfs/personal-social-and-emotional-development",
    );
    expect(screen.getByRole("link", { name: "Literacy" })).toHaveAttribute(
      "href",
      "/eyfs/literacy",
    );
  });

  it("renders when current subject matches a tab", () => {
    mockUseParams.mockReturnValue({ subjectSlug: "maths" });
    const { container } = render(<EYFSNavigation subjectTabs={subjectTabs} />);

    expect(container.querySelector("nav")).toBeInTheDocument();
  });

  it("renders when current subject does not match any tab", () => {
    mockUseParams.mockReturnValue({ subjectSlug: "unknown" });
    const { container } = render(<EYFSNavigation subjectTabs={subjectTabs} />);

    expect(container.querySelector("nav")).toBeInTheDocument();
  });

  it("renders when params has no subjectSlug", () => {
    mockUseParams.mockReturnValue({});
    const { container } = render(<EYFSNavigation subjectTabs={subjectTabs} />);

    expect(container.querySelector("nav")).toBeInTheDocument();
  });
});
