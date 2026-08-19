import type { OakIconName } from "@oaknational/oak-components";
import type { PortableTextBlock } from "@portabletext/types";

/**
 * Copy for the Oak Curriculum MCP landing page.
 *
 * Taken from the final Figma designs (🌳 Oak MCP v1, the "OWA OAK MCP landing
 * page - thenational.academy/mcp >1280" frame). Kept in one place so copy
 * review does not mean reading through components.
 *
 * Link targets are still placeholders, except the feedback CTA, which Figma
 * annotates as mailto:support@thenational.academy.
 */

/**
 * Appears twice — the hero caveat and the footnote under "Choose your AI
 * assistant" — so it lives here to keep the two in step.
 */
export const mcpMoreAssistantsNote =
  "We’re starting with Claude, and working to bring Oak to ChatGPT and more AI assistants soon.";

export const mcpHero = {
  title: "Bring Oak’s curriculum into your AI assistant",
  body: "Build on our free, subject expert-designed curriculum right inside the AI assistants you already use. Plan lessons, sequence a whole curriculum, and create resources, all grounded in our national curriculum-aligned content.",
  note: mcpMoreAssistantsNote,
} as const;

export const mcpIntro = {
  title: "See it in action",
  paragraphs: [
    "Our curriculum is now available in Claude, with more AI assistants to follow.",
    "With Oak connected, your AI assistant can plan lessons, sequence a whole curriculum, or map how a topic builds across year groups. And that’s just a start.",
    "Everything is grounded in our national curriculum-aligned resources, written and quality-assured by subject experts, and free to use. You stay in control: you’re the expert, and you know what works for your pupils.",
  ],
  smallPrint:
    "We don’t charge for this service, and all our curriculum plans and resources are free to access. Your AI provider’s account and plan rules may apply.",
} as const;

export type McpCapability = {
  title: string;
  body: string;
  iconName: OakIconName;
  background:
    | "bg-decorative1-main"
    | "bg-decorative2-main"
    | "bg-decorative3-main"
    | "bg-decorative4-main"
    | "bg-decorative5-subdued";
};

export const mcpCapabilities: {
  title: string;
  body: string;
  items: readonly McpCapability[];
} = {
  title: "What can you do?",
  body: "What you love about Oak, now in the AI assistant you already use. Here’s what that lets you do:",
  items: [
    {
      title: "Find lessons and resources",
      body: "Search our fully sequenced curriculum by subject, topic, key stage, year, or exam board.",
      iconName: "search",
      background: "bg-decorative3-main",
    },
    {
      title: "Explore curriculum progression",
      body: "See where a concept is taught across our curriculum and builds across year groups and phases.",
      iconName: "book-steps",
      background: "bg-decorative2-main",
    },
    {
      title: "Check prior knowledge and misconceptions",
      body: "Know what to teach first and the common errors to plan for, mapped across our curriculum.",
      iconName: "quiz",
      background: "bg-decorative4-main",
    },
    {
      title: "Adapt content for your pupils",
      body: "Ask your AI assistant to suggest ways to scaffold a task or reflect your local context, and refine it for your class.",
      iconName: "ai-additional-material",
      background: "bg-decorative5-subdued",
    },
    {
      title: "Create resources grounded in Oak",
      body: "Bring it all together: build on our expert, national curriculum-aligned content to create retrieval questions, quizzes, knowledge organisers, and more.",
      iconName: "logo",
      background: "bg-decorative1-main",
    },
  ],
} as const;

/**
 * The message the "Try in Claude" deep link drops into Claude's composer, and
 * the same text the small print tells you to paste if it arrives empty. Both
 * read from here so they cannot drift apart.
 */
export const mcpInstallPrompt =
  "Install the Oak National Academy plugin and its connector, then give me some examples of what I can do with it!";

/** Portable text span. Emphasis uses the `strong` mark, as elsewhere in OWA. */
const span = (key: string, text: string, marks: string[] = []) => ({
  _type: "span" as const,
  _key: key,
  text,
  marks,
});

/**
 * The provider's own mark is deliberately absent: it is a third-party
 * trademark, and this repo is public and MIT licensed, so it should not be
 * committed here. A neutral Oak icon stands in until Oak has permission and
 * the mark can be served from Cloudinary like other imagery.
 */
export type McpAssistant = {
  name: string;
  ctaLabel: string;
  ctaHref: string;
  /** Tile colour behind the provider icon. */
  background: "bg-decorative6-main";
};

export const mcpAssistants: {
  title: string;
  body: string;
  items: readonly McpAssistant[];
  steps: PortableTextBlock[];
  smallPrint: PortableTextBlock[];
} = {
  title: "Choose your AI assistant",
  body: "Start in the AI assistant you already use.",
  items: [
    {
      name: "Claude",
      ctaLabel: "Try in Claude",
      // `?q=` prefills the composer without sending, which is what the install
      // steps describe ("a message ready to send... click the orange arrow").
      ctaHref: `https://claude.ai/new?q=${encodeURIComponent(mcpInstallPrompt)}`,
      background: "bg-decorative6-main",
    },
  ],
  steps: [
    {
      _type: "block",
      _key: "install-step-1",
      style: "normal",
      listItem: "number",
      level: 1,
      markDefs: [],
      children: [
        span("s1-a", "Click "),
        span("s1-b", "Try in Claude", ["strong"]),
        span(
          "s1-c",
          ". Claude opens in a new tab with a message ready to send. Click the orange arrow to send it, and an install card appears in the chat.",
        ),
      ],
    },
    {
      _type: "block",
      _key: "install-step-2",
      style: "normal",
      listItem: "number",
      level: 1,
      markDefs: [],
      children: [
        span("s2-a", "Tap "),
        span("s2-b", "Install", ["strong"]),
        span("s2-c", " on the card, then "),
        span("s2-d", "authorise Oak", ["strong"]),
        span(
          "s2-e",
          " when prompted. Claude is now ready to draw on the Oak curriculum.",
        ),
      ],
    },
  ],
  smallPrint: [
    {
      _type: "block",
      _key: "small-print-paste",
      style: "normal",
      markDefs: [],
      children: [
        span(
          "sp1-a",
          "If Claude opens with an empty message box, paste this in and send it: ",
        ),
        span("sp1-b", mcpInstallPrompt, ["strong"]),
      ],
    },
    {
      _type: "block",
      _key: "small-print-more-assistants",
      style: "normal",
      markDefs: [],
      children: [span("sp2-a", mcpMoreAssistantsNote)],
    },
  ],
};

export const mcpResponsibleUse = {
  title: "Use it responsibly",
  intro: [
    "Don’t enter pupil names, personal information, safeguarding information or confidential school data into a third-party AI service.",
    "Follow your school’s AI policy, and check the terms and privacy information for the assistant you use.",
  ],
  points: [
    {
      title: "Check the source",
      body: "Open the linked Oak lesson or unit and confirm it matches what you intended.",
    },
    {
      title: "Review the output",
      body: "AI-generated responses can contain mistakes, miss context or combine information in unhelpful ways. Check the response before you rely on it or share it with pupils.",
    },
    {
      title: "Make it fit your pupils",
      body: "You are the expert and know your pupils best. As with all resources, check carefully that what you create is right for your pupils and context.",
    },
  ],
} as const;

export const mcpHowItWorks = {
  title: "How it works",
  groups: [
    {
      title: "Oak provides",
      items: [
        "Our fully sequenced curriculum: lessons, units and resources across 17 subjects, from key stage 1 to 4",
        "Keywords, common misconceptions, prior knowledge requirements, high-quality explanations, quiz questions, cross-phase topics and more",
        "How lessons, units and concepts connect across the curriculum",
        "Source details and links",
        "Tools that let an AI assistant retrieve this information",
      ],
    },
    {
      title: "The AI provider",
      items: [
        "Runs the chat or assistant",
        "Interprets your request",
        "Decides when to draw on Oak’s tools and curriculum",
        "Combines information into a response",
        "Applies its own account, privacy and usage terms",
      ],
    },
  ],
} as const;

/**
 * Sits inside "How it works" in the final design, so it is rendered as a
 * subsection rather than its own top-level section.
 */
export const mcpSupport = {
  title: "Questions or problems?",
  bodyBefore:
    "Find answers about accounts and cost, supported AI assistants, connecting Oak, privacy and data sharing, and what to do when something isn’t working, in our ",
  linkLabel: "Help centre",
  href: "https://support.thenational.academy/using-oak-mcp",
  bodyAfter: ".",
} as const;

export const mcpOutputWarning =
  "Outputs are AI-generated and not endorsed by Oak. Always check that what you create is right for your pupils and context.";

export const mcpFeedback = {
  title: "Give feedback",
  body: "This is new, and still in development. We’re continually improving it, and your feedback helps us make it better for you and your pupils.",
  ctaLabel: "Share feedback",
  // Figma annotates this button with "Should link to: support@thenational.academy".
  ctaHref: "mailto:support@thenational.academy",
} as const;
