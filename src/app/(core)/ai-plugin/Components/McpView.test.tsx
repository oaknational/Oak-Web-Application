import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { McpView } from "./McpView";

import {
  mcpAssistants,
  mcpCapabilities,
  mcpFeedback,
  mcpHero,
  mcpHowItWorks,
  mcpInstallPrompt,
  mcpIntro,
  mcpLicence,
  mcpMoreAssistantsNote,
  mcpOutputWarning,
  mcpResponsibleUse,
  mcpSchoolSetup,
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

  it("lists ChatGPT before Claude in the hero", () => {
    const { getAllByRole } = render(<McpView />);

    const heroLinks = getAllByRole("link", { name: /Try in/ }).slice(0, 2);

    expect(heroLinks[0]).toHaveTextContent("Try in ChatGPT");
    expect(heroLinks[1]).toHaveTextContent("Try in Claude");
  });

  it("marks the tools that are coming soon in the hero", () => {
    const { getByText } = render(<McpView />);

    expect(getByText(mcpHero.comingSoon.label)).toBeInTheDocument();
    mcpHero.comingSoon.tools.forEach((tool) => {
      expect(getByText(tool)).toBeInTheDocument();
    });
  });

  it("opens 'Choose your AI tool' on the Individual teacher tab", () => {
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpAssistants.title });

    expect(
      within(section).getByRole("link", { name: "Individual teacher" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(section).getByRole("link", { name: "School or trust" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("switches to the organisation setup on the School or trust tab", async () => {
    const user = userEvent.setup({ delay: null });
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpAssistants.title });
    await user.click(
      within(section).getByRole("link", { name: "School or trust" }),
    );

    expect(
      within(section).getByRole("link", { name: "School or trust" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(section).queryByRole("link", { name: /Try in/ }),
    ).not.toBeInTheDocument();
    mcpSchoolSetup.providers.forEach((provider) => {
      expect(
        within(section).getByRole("heading", { name: provider.name }),
      ).toBeInTheDocument();
      expect(
        within(section).getByRole("link", {
          name: new RegExp(provider.guideLabel),
        }),
      ).toHaveAttribute("href", provider.guideHref);
    });
  });

  it("shows the more-tools banner under both tabs", async () => {
    const user = userEvent.setup({ delay: null });
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpAssistants.title });
    expect(
      within(section).getByText(mcpMoreAssistantsNote),
    ).toBeInTheDocument();

    await user.click(
      within(section).getByRole("link", { name: "School or trust" }),
    );
    expect(
      within(section).getByText(mcpMoreAssistantsNote),
    ).toBeInTheDocument();
  });

  it("offers ChatGPT and Claude as assistants, each with its own Try link", () => {
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
    // The tabs are a list too, so count only the numbered (ordered) lists.
    const steps = within(section)
      .getAllByRole("list")
      .filter((list) => list.tagName === "OL")
      .flatMap((list) => within(list).getAllByRole("listitem"));

    const expectedStepCount = mcpAssistants.items.reduce(
      (total, assistant) => total + assistant.steps.length,
      0,
    );
    expect(steps).toHaveLength(expectedStepCount);
    expect(steps[0]).toHaveTextContent("Try in ChatGPT");
    expect(steps[1]).toHaveTextContent("authorise Oak");
    expect(steps[2]).toHaveTextContent("Try in Claude");
    expect(steps[3]).toHaveTextContent("authorise Oak");
  });

  it("links the licence and Oak's terms from 'How it works'", () => {
    const { getByRole } = render(<McpView />);

    const section = getByRole("region", { name: mcpHowItWorks.title });

    expect(
      within(section).getByRole("link", {
        name: new RegExp(mcpLicence.licenceLink.label),
      }),
    ).toHaveAttribute("href", mcpLicence.licenceLink.href);
    expect(
      within(section).getByRole("link", {
        name: new RegExp(mcpLicence.termsLink.label),
      }),
    ).toHaveAttribute("href", mcpLicence.termsLink.href);
    expect(within(section).getByText(mcpLicence.ukOnly)).toBeInTheDocument();
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

  it("warns that Oak does not endorse third-party output, straight after 'Use it responsibly'", () => {
    const { getByText, getByRole } = render(<McpView />);

    const warning = getByText(mcpOutputWarning);
    const responsibleUse = getByRole("region", {
      name: mcpResponsibleUse.title,
    });
    const howItWorks = getByRole("region", { name: mcpHowItWorks.title });

    expect(
      responsibleUse.compareDocumentPosition(warning) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      warning.compareDocumentPosition(howItWorks) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
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
