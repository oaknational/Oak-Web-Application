import type { OakIconName } from "@oaknational/oak-components";
import type { PortableTextBlock } from "@portabletext/types";

/**
 * Copy for the Oak Curriculum MCP landing page.
 *
 * Taken from the final Figma designs (🌳 Oak MCP v1, the "OWA OAK MCP landing
 * page - thenational.academy/mcp >1280" frame). Kept in one place so copy
 * review does not mean reading through components.
 *
 * Some link targets are still placeholders.
 */

/**
 * Appears twice — the hero caveat and the footnote under "Choose your AI
 * assistant" — so it lives here to keep the two in step.
 */
export const mcpMoreAssistantsNote =
  "We’re starting with Claude and ChatGPT, and working to bring Oak to more AI assistants soon.";

export const mcpHero = {
  title: "Bring Oak’s curriculum into your AI assistant",
  body: "Build on our free, subject expert-designed curriculum right inside the AI assistants you already use. Plan lessons, sequence a whole curriculum, and create resources, all grounded in our national curriculum-aligned content.",
  note: mcpMoreAssistantsNote,
} as const;

export const mcpIntro = {
  title: "See it in action",
  paragraphs: [
    "Our curriculum is now available in Claude and ChatGPT, with more AI assistants to follow.",
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
 * The message the "Try in <assistant>" deep links drop into the composer, and
 * the same text the small print tells you to paste if it arrives empty. All
 * three read from here so they cannot drift apart.
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
  background: "bg-decorative6-main" | "bg-inverted";
  /** This provider's own numbered install steps. */
  steps: PortableTextBlock[];
  /** The paste-it-yourself fallback for this provider's composer. */
  pasteNote: PortableTextBlock[];
};

const pasteNoteFor = (
  key: string,
  assistantName: string,
): PortableTextBlock[] => [
  {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [
      span(
        `${key}-a`,
        `If ${assistantName} opens with an empty message box, paste this in and send it: `,
      ),
      span(`${key}-b`, mcpInstallPrompt, ["strong"]),
    ],
  },
];

export const mcpAssistants: {
  title: string;
  body: string;
  items: readonly McpAssistant[];
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
      steps: [
        {
          _type: "block",
          _key: "claude-step-1",
          style: "normal",
          listItem: "number",
          level: 1,
          markDefs: [],
          children: [
            span("cs1-a", "Click "),
            span("cs1-b", "Try in Claude", ["strong"]),
            span(
              "cs1-c",
              ". Claude opens in a new tab with a message ready to send. Click the orange arrow to send it, and an install card appears in the chat.",
            ),
          ],
        },
        {
          _type: "block",
          _key: "claude-step-2",
          style: "normal",
          listItem: "number",
          level: 1,
          markDefs: [],
          children: [
            span("cs2-a", "Tap "),
            span("cs2-b", "Install", ["strong"]),
            span("cs2-c", " on the card, then "),
            span("cs2-d", "authorise Oak", ["strong"]),
            span(
              "cs2-e",
              " when prompted. Claude is now ready to draw on the Oak curriculum.",
            ),
          ],
        },
      ],
      pasteNote: pasteNoteFor("claude-paste", "Claude"),
    },
    {
      name: "ChatGPT",
      ctaLabel: "Try in ChatGPT",
      // Same `?q=` prefill behaviour as Claude's deep link.
      ctaHref: `https://chatgpt.com/?q=${encodeURIComponent(mcpInstallPrompt)}`,
      background: "bg-inverted",
      steps: [
        {
          _type: "block",
          _key: "chatgpt-step-1",
          style: "normal",
          listItem: "number",
          level: 1,
          markDefs: [],
          children: [
            span("gs1-a", "Click "),
            span("gs1-b", "Try in ChatGPT", ["strong"]),
            span(
              "gs1-c",
              ". ChatGPT opens in a new tab with a message ready to send. Click the blue arrow to send it, and an install card appears in the chat.",
            ),
          ],
        },
        {
          _type: "block",
          _key: "chatgpt-step-2",
          style: "normal",
          listItem: "number",
          level: 1,
          markDefs: [],
          children: [
            span("gs2-a", "Tap "),
            span("gs2-b", "Install", ["strong"]),
            span("gs2-c", " on the card, then "),
            span("gs2-d", "authorise Oak", ["strong"]),
            span(
              "gs2-e",
              " when prompted. ChatGPT is now ready to draw on the Oak curriculum.",
            ),
          ],
        },
      ],
      pasteNote: pasteNoteFor("chatgpt-paste", "ChatGPT"),
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
    "Find answers about accounts and cost, connecting Oak, privacy and data sharing, and what to do when something isn’t working, in our help articles for ",
  links: [
    {
      label: "Claude",
      href: "https://support.thenational.academy/using-oak-mcp-claude",
    },
    {
      label: "ChatGPT",
      href: "https://support.thenational.academy/using-oak-mcp-openai",
    },
  ],
  joiner: " and ",
  bodyAfter: ".",
} as const;

export const mcpOutputWarning =
  "Outputs are AI-generated and not endorsed by Oak. Always check that what you create is right for your pupils and context.";

export const mcpFeedback = {
  title: "Give feedback",
  body: "This is new, and still in development. We’re continually improving it, and your feedback helps us make it better for you and your pupils.",
  ctaLabel: "Share feedback",
  // Figma annotates this button with the link to this HubSpot survey form.
  ctaHref: "https://survey.hsforms.com/2vy6BnIvzTASqx1DbH8CaJAbvumd",
} as const;
