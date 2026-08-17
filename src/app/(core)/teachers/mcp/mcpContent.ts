import type { OakIconName } from "@oaknational/oak-components";

/**
 * Copy for the Oak Curriculum MCP landing page.
 *
 * The Figma source (🌳 Oak MCP v1) marks this content as
 * "placeholder/pending", so it is kept in one place to make review and
 * replacement straightforward. Nothing here is fetched from an API.
 */

export const mcpHero = {
  title: "Bring the Oak curriculum into your AI assistant",
  body: "Connect the AI assistant you already use to Oak’s free curriculum content, designed for schools in the UK. With Oak Curriculum MCP you can find relevant lessons and units, explore what pupils need to know, and get a grounded starting point for planning and questions.",
} as const;

export const mcpIntro = {
  title: "Introducing Oak Curriculum MCP",
  lead: "Oak curriculum, available where you already use AI.",
  paragraphs: [
    "Oak Curriculum MCP is a connection between Oak’s structured curriculum and compatible AI assistants.",
    "When you ask a teaching question, the assistant can look up relevant Oak content instead of relying only on its general knowledge. Oak supplies curriculum information and source details; the assistant interprets your request and writes the response.",
  ],
  steps: [
    {
      title: "1. Connect Oak",
      body: "Add Oak Curriculum to a supported AI assistant.",
    },
    {
      title: "2. Ask naturally",
      body: "Ask for a lesson, a unit, prior knowledge, curriculum progression or a starting point for questions.",
    },
    {
      title: "3. Check and adapt",
      body: "Open the Oak sources, review the response and shape it for your pupils and context.",
    },
  ],
  smallPrint:
    "Oak does not charge for this service. Your AI provider’s account and plan rules may apply.",
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
  items: readonly McpCapability[];
} = {
  title: "What can you do?",
  items: [
    {
      title: "Find lessons and resources",
      body: "Search Oak’s fully sequenced curriculum by subject, topic, key stage, year or exam board.",
      iconName: "search",
      background: "bg-decorative1-main",
    },
    {
      title: "Check prior knowledge and misconceptions",
      body: "Understand what pupils need to know first and the common misconceptions to anticipate.",
      iconName: "quiz",
      background: "bg-decorative4-main",
    },
    {
      title: "Explore curriculum progression",
      body: "See where a concept is taught and how it develops across year groups and phases.",
      iconName: "curriculum-plan",
      background: "bg-decorative3-main",
    },
    {
      title: "Adapt content for your pupils and context",
      body: "Ask your AI assistant to scaffold tasks or reflect a local context, then check and refine the result for your class.",
      // Figma uses the "Lesson plan" glyph, but oak-components' `teacher-lesson`
      // and `teacher-unit` assets are currently blank coloured circles.
      iconName: "pencil",
      background: "bg-decorative5-subdued",
    },
    {
      title: "Create resources grounded in Oak",
      body: "Use Oak’s key learning, vocabulary, quiz questions and misconceptions to create retrieval questions, quizzes or knowledge organisers.",
      iconName: "additional-material",
      background: "bg-decorative2-main",
    },
  ],
} as const;

export type McpAssistant = {
  name: string;
  ctaLabel: string;
  ctaHref: string;
  guideLabel: string;
  guideHref: string;
  logoSrc: string;
  /** Tile colour behind the provider logo. */
  background: "bg-decorative6-main" | "bg-inverted";
};

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
      ctaHref: "https://claude.ai/",
      guideLabel: "Claude setup guide",
      guideHref: "https://support.thenational.academy/using-oak-mcp",
      logoSrc: "/images/mcp/claude-logo.png",
      background: "bg-decorative6-main",
    },
    {
      name: "ChatGPT",
      ctaLabel: "Try in ChatGPT",
      ctaHref: "https://chatgpt.com/",
      guideLabel: "ChatGPT setup guide",
      guideHref: "https://support.thenational.academy/using-oak-mcp",
      logoSrc: "/images/mcp/chatgpt-logo.png",
      background: "bg-inverted",
    },
  ],
} as const;

export const mcpResponsibleUse = {
  title: "Use it responsibly",
  intro: [
    "Do not enter pupil names, personal information, safeguarding information or confidential school data into a third-party AI service.",
    "Follow your school’s AI policy and review the terms and privacy information for the provider you use.",
  ],
  points: [
    {
      title: "Check the source",
      body: "Open the linked Oak lesson or unit and confirm that it matches your intention.",
    },
    {
      title: "Review the output",
      body: "AI-generated responses can contain mistakes, miss context or combine information in an unhelpful way.",
    },
    {
      title: "Make it fit your pupils",
      body: "Use your professional judgement to adapt the response for your pupils, curriculum and setting.",
    },
  ],
} as const;

export const mcpHowItWorks = {
  title: "How it works",
  groups: [
    {
      title: "Oak provides",
      items: [
        "Structured UK curriculum content",
        "Lessons, units and curriculum relationships",
        "Key learning, prior knowledge and misconceptions where available",
        "Source details and links",
        "Tools that allow a compatible assistant to retrieve this information",
      ],
    },
    {
      title: "The AI provider",
      items: [
        "Operates the chat or assistant",
        "Interprets the teacher’s request",
        "Decides when to call Oak’s tools and curriculum",
        "Combines information into a response",
        "Applies its own account, privacy and usage terms",
      ],
    },
  ],
} as const;

export const mcpSupport = {
  title: "Questions or problems?",
  bodyBefore:
    "Find answers about accounts and cost, supported AI assistants, connecting Oak, privacy and data sharing, and what to do when something is not working in our ",
  linkLabel: "Help and FAQs",
  href: "https://support.thenational.academy/using-oak-mcp",
  bodyAfter: ".",
} as const;

export const mcpDeveloper = {
  tagLabel: "For developers and organisations",
  title: "Connect a product or MCP client",
  body: "Use the canonical Oak Curriculum MCP endpoint to search and retrieve structured curriculum information.",
  configLabel: "Add this to your MCP client configuration:",
  config: `{
  "mcpServers": {
    "oak-curriculum": {
      "type": "http",
      "url": "https://curriculum-mcp-alpha.oaknational.dev/mcp"
    }
  }
}`,
  authBefore: "This server uses ",
  authLinkLabel: "OAuth 2.1 authorisation",
  authHref:
    "https://curriculum-mcp-alpha.oaknational.dev/.well-known/oauth-protected-resource",
  authAfter:
    ". You will be prompted to log in. Access is currently for internal staff or by invitation.",
} as const;

export const mcpOutputWarning =
  "Oak does not control outputs produced by a third-party assistant. Review generated outputs before relying on it or sharing it with pupils.";

export const mcpFeedback = {
  title: "Give feedback",
  body: "Oak MCP is still in development, and we’re the first to admit it’s not perfect. It doesn’t yet have all the features you’ll want, and you may spot the odd glitch or mistake. We’re improving Oak MCP all the time, and your feedback helps us make it better for you and your pupils.",
  ctaLabel: "Share feedback",
  ctaHref: "https://support.thenational.academy/using-oak-mcp",
} as const;
