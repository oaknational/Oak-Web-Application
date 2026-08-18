import type { OakIconName } from "@oaknational/oak-components";

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

/** A run of copy that may be emphasised, so bold phrases stay in this file. */
export type McpTextSegment = {
  text: string;
  bold?: boolean;
};

export const mcpHero = {
  title: "Bring Oak’s curriculum into your AI assistant",
  body: "Build on our free, subject expert-designed curriculum right inside the AI assistants you already use. Plan lessons, sequence a whole curriculum, and create resources, all grounded in our national curriculum-aligned content.",
  note: "We’re starting with Claude, and working to bring Oak to more AI assistants soon.",
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

export type McpAssistant = {
  name: string;
  ctaLabel: string;
  ctaHref: string;
  logoSrc: string;
  /** Tile colour behind the provider logo. */
  background: "bg-decorative6-main";
};

export const mcpAssistants: {
  title: string;
  body: string;
  items: readonly McpAssistant[];
  steps: readonly (readonly McpTextSegment[])[];
  smallPrint: readonly (readonly McpTextSegment[])[];
} = {
  title: "Choose your AI assistant",
  body: "Start in the AI assistant you already use.",
  items: [
    {
      name: "Claude",
      ctaLabel: "Try in Claude",
      ctaHref: "https://claude.ai/",
      logoSrc: "/images/mcp/claude-logo.png",
      background: "bg-decorative6-main",
    },
  ],
  steps: [
    [
      { text: "Click " },
      { text: "Try in Claude", bold: true },
      {
        text: ". Claude opens in a new tab with a message ready to send. Click the orange arrow to send it, and an install card appears in the chat.",
      },
    ],
    [
      { text: "Tap " },
      { text: "Install", bold: true },
      { text: " on the card, then " },
      { text: "authorise Oak", bold: true },
      {
        text: " when prompted. Claude is now ready to draw on the Oak curriculum.",
      },
    ],
  ],
  smallPrint: [
    [
      {
        text: "If Claude opens with an empty message box, paste this in and send it: ",
      },
      {
        text: "Install the Oak National Academy plugin and its connector.",
        bold: true,
      },
    ],
    [
      {
        text: "We’re starting with Claude, and working to bring Oak to more AI assistants soon.",
      },
    ],
  ],
} as const;

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
