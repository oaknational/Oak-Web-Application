import { within } from "@testing-library/react";

import { McpView } from "./McpView";

import {
  mcpAssistants,
  mcpCapabilities,
  mcpFeedback,
  mcpHero,
  mcpHowItWorks,
  mcpInstallPrompt,
  mcpIntro,
  mcpOutputWarning,
  mcpResponsibleUse,
  mcpSupport,
} from "@/app/(core)/mcp/mcpContent";
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
      mcpIntro.title,
      mcpCapabilities.title,
      mcpAssistants.title,
      mcpResponsibleUse.title,
      mcpHowItWorks.title,
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

  it("offers Claude as the only assistant, with a Try in Claude link", () => {
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpAssistants.title });
    const assistant = mcpAssistants.items[0];

    expect(mcpAssistants.items).toHaveLength(1);
    expect(
      within(section).getByRole("heading", { name: "Claude" }),
    ).toBeInTheDocument();
    expect(
      within(section).getByRole("link", {
        name: new RegExp(assistant!.ctaLabel),
      }),
    ).toHaveAttribute("href", assistant!.ctaHref);
  });

  it("prefills Claude's composer with the install prompt", () => {
    const { getAllByRole } = render(<McpView />);

    const tryLinks = getAllByRole("link", { name: /Try in Claude/ });

    // The hero and the assistant card share one href.
    expect(tryLinks.length).toBeGreaterThan(0);
    tryLinks.forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      expect(new URL(href).searchParams.get("q")).toBe(mcpInstallPrompt);
    });
  });

  it("lists the numbered steps for installing the connector", () => {
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpAssistants.title });
    const steps = within(section).getAllByRole("listitem");

    expect(steps).toHaveLength(mcpAssistants.steps.length);
    expect(steps[0]).toHaveTextContent("Try in Claude");
    expect(steps[1]).toHaveTextContent("authorise Oak");
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

  it("nests 'Questions or problems?' inside 'How it works'", () => {
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpHowItWorks.title });

    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: mcpSupport.title,
      }),
    ).toBeInTheDocument();
    expect(
      within(section).getByRole("link", {
        name: new RegExp(mcpSupport.linkLabel),
      }),
    ).toHaveAttribute("href", mcpSupport.href);
  });

  it("warns that Oak does not endorse third-party output", () => {
    const { getByText } = render(<McpView />);

    expect(getByText(mcpOutputWarning)).toBeInTheDocument();
  });

  it("points the feedback CTA at the support inbox", () => {
    const { getByRole } = render(<McpView />);

    const cta = getByRole("link", { name: mcpFeedback.ctaLabel });

    expect(cta).toHaveAttribute("href", mcpFeedback.ctaHref);
    expect(cta).not.toHaveAttribute("target", "_blank");
  });

  it("withholds the referrer on every link that opens a new tab", () => {
    const { getAllByRole } = render(<McpView />);

    const externalLinks = getAllByRole("link").filter(
      (link) => link.getAttribute("target") === "_blank",
    );

    expect(externalLinks.length).toBeGreaterThan(0);
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute(
        "rel",
        expect.stringContaining("noreferrer"),
      );
    });
  });
});
