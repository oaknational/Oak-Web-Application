import { within } from "@testing-library/react";

import { McpView } from "./McpView";

import {
  mcpAssistants,
  mcpCapabilities,
  mcpDeveloper,
  mcpFeedback,
  mcpHero,
  mcpHowItWorks,
  mcpOutputWarning,
} from "@/app/(core)/teachers/mcp/mcpContent";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("McpView", () => {
  it("renders the hero as the only h1", () => {
    const { getAllByRole } = render(<McpView />);

    const level1 = getAllByRole("heading", { level: 1 });

    expect(level1).toHaveLength(1);
    expect(level1[0]).toHaveTextContent(mcpHero.title);
  });

  it("renders every section heading as an h2, in design order", () => {
    const { getAllByRole } = render(<McpView />);

    const headings = getAllByRole("heading", { level: 2 }).map(
      (heading) => heading.textContent,
    );

    expect(headings).toEqual([
      "Introducing Oak Curriculum MCP",
      mcpCapabilities.title,
      mcpAssistants.title,
      "Use it responsibly",
      mcpHowItWorks.title,
      "Questions or problems?",
      mcpDeveloper.title,
      mcpFeedback.title,
    ]);
  });

  it("renders each capability with its title and body", () => {
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpCapabilities.title });

    mcpCapabilities.items.forEach((capability) => {
      expect(
        within(section).getByRole("heading", { name: capability.title }),
      ).toBeInTheDocument();
      expect(within(section).getByText(capability.body)).toBeInTheDocument();
    });
  });

  it("links each assistant to its setup guide", () => {
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpAssistants.title });

    mcpAssistants.items.forEach((assistant) => {
      expect(
        within(section).getByRole("link", {
          name: new RegExp(assistant.guideLabel),
        }),
      ).toHaveAttribute("href", assistant.guideHref);
    });
  });

  it("renders both 'Oak provides' and 'The AI provider' lists in full", () => {
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpHowItWorks.title });

    mcpHowItWorks.groups.forEach((group) => {
      expect(
        within(section).getByRole("heading", { name: group.title }),
      ).toBeInTheDocument();
      group.items.forEach((item) => {
        expect(within(section).getByText(item)).toBeInTheDocument();
      });
    });
  });

  it("renders the MCP endpoint configuration", () => {
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpDeveloper.title });

    expect(section).toHaveTextContent("curriculum-mcp-alpha.oaknational.dev");
  });

  it("warns that Oak does not control third-party output", () => {
    const { getByText } = render(<McpView />);

    expect(getByText(mcpOutputWarning)).toBeInTheDocument();
  });

  it("opens external links in a new tab safely", () => {
    const { getAllByRole } = render(<McpView />);

    const externalLinks = getAllByRole("link").filter(
      (link) => link.getAttribute("target") === "_blank",
    );

    expect(externalLinks.length).toBeGreaterThan(0);
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    });
  });
});
