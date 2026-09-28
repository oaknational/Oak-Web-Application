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
} from "@/app/(core)/ai-plugin/mcpContent";
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

  it("offers Claude and ChatGPT as assistants, each with its own Try link", () => {
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpAssistants.title });

    expect(mcpAssistants.items).toHaveLength(2);
    mcpAssistants.items.forEach((assistant) => {
      expect(
        within(section).getByRole("heading", { name: assistant.name }),
      ).toBeInTheDocument();
      expect(
        within(section).getByRole("link", {
          name: new RegExp(assistant.ctaLabel),
        }),
      ).toHaveAttribute("href", assistant.ctaHref);
    });
  });

  it("prefills every assistant's composer with the install prompt", () => {
    const { getAllByRole } = render(<McpView />);

    const tryLinks = getAllByRole("link", { name: /Try in (Claude|ChatGPT)/ });

    // The hero and each assistant card share the same href per provider.
    expect(tryLinks.length).toBeGreaterThan(0);
    tryLinks.forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      expect(new URL(href).searchParams.get("q")).toBe(mcpInstallPrompt);
    });
  });

  it("lists each assistant's own numbered install steps", () => {
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpAssistants.title });
    const steps = within(section).getAllByRole("listitem");

    const expectedStepCount = mcpAssistants.items.reduce(
      (total, assistant) => total + assistant.steps.length,
      0,
    );
    expect(steps).toHaveLength(expectedStepCount);
    expect(steps[0]).toHaveTextContent("Try in Claude");
    expect(steps[1]).toHaveTextContent("authorise Oak");
    expect(steps[2]).toHaveTextContent("Try in ChatGPT");
    expect(steps[3]).toHaveTextContent("authorise Oak");
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
    mcpSupport.links.forEach((link) => {
      expect(
        within(section).getByRole("link", { name: new RegExp(link.label) }),
      ).toHaveAttribute("href", link.href);
    });
  });

  it("warns that Oak does not endorse third-party output", () => {
    const { getByText } = render(<McpView />);

    expect(getByText(mcpOutputWarning)).toBeInTheDocument();
  });

  it("points the feedback CTA at the feedback survey", () => {
    const { getByRole } = render(<McpView />);

    const cta = getByRole("link", { name: new RegExp(mcpFeedback.ctaLabel) });

    expect(cta).toHaveAttribute("href", mcpFeedback.ctaHref);
    expect(cta).toHaveAttribute("target", "_blank");
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
