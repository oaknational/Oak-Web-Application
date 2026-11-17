import type {
  NationalCurriculumInsightsKeyStage,
  NationalCurriculumInsightsModule,
  NationalCurriculumInsightsPhase,
  NationalCurriculumInsightsSubject,
} from "@/common-lib/cms-types/nationalCurriculumInsights";

const text = (value: string, fields: Record<string, unknown> = {}) => ({
  _type: "block",
  style: "normal",
  children: [{ _type: "span", text: value, marks: [] }],
  ...fields,
});

const headlines = (scope: string): NationalCurriculumInsightsModule => ({
  __typename: "NationalCurriculumInsightsOverviewSection",
  heading: "The headlines in 60 seconds",
  bodyPortableText: [
    text(
      `The ${scope} curriculum builds on what pupils already know. These examples show how the guidance can support subject planning and discussion.`,
    ),
    text(
      "Teachers can look at the sequence of ideas before choosing where to adapt their existing plans.",
    ),
  ],
  quote: {
    quote:
      "Start with a clear picture of what pupils should understand and how each idea builds on the last.",
    attribution: "A subject specialist",
    role: "Curriculum lead",
  },
});

const sections = (scope: string): NationalCurriculumInsightsModule[] => [
  headlines(scope),
  {
    __typename: "NationalCurriculumInsightsChangesSection",
    heading: `What's changed in the ${scope} national curriculum?`,
    changes: [
      {
        id: "sequence",
        title: "A clearer sequence of ideas",
        whyItMatters:
          "Teachers can see how the main ideas develop across the curriculum.",
        detailPortableText: [
          text(
            "Review how each unit builds on earlier learning. Keep opportunities for pupils to practise and explain what they understand.",
          ),
          text(
            "Use the curriculum overview to discuss any gaps before changing individual lessons.",
          ),
        ],
      },
      {
        id: "language",
        title: "More explicit subject vocabulary",
        whyItMatters:
          "Shared language helps pupils explain the connections between ideas.",
        detailPortableText: [
          text(
            "Choose the terms pupils need to use confidently and revisit them in different contexts.",
          ),
          text("This is an example of an editable numbered list."),
          text("Identify the key terms.", { listItem: "number", level: 1 }),
          text("Plan where pupils will use them.", {
            listItem: "number",
            level: 1,
          }),
        ],
      },
    ],
  },
  {
    __typename: "NationalCurriculumInsightsUnchangedSection",
    heading: `What's stayed the same in the ${scope} national curriculum?`,
    contentPortableText: [
      text("Pupils will still need opportunities to:"),
      text("Build secure knowledge over time.", {
        listItem: "bullet",
        level: 1,
      }),
      text("Apply their learning in different contexts.", {
        listItem: "bullet",
        level: 1,
      }),
      text("Explain their ideas clearly.", { listItem: "bullet", level: 1 }),
    ],
  },
  ...(["teacher", "schoolLeader"] as const).map((audience) => ({
    __typename: "NationalCurriculumInsightsChecklistSection" as const,
    audience,
    heading:
      audience === "teacher" ? "Teacher checklist" : "School leader checklist",
    items: [
      {
        id: "review",
        contentPortableText: [
          text(
            "Review the sequence of learning and identify where pupils need more time to practise before moving on to the next idea.",
          ),
        ],
      },
      {
        id: "discuss",
        contentPortableText: [
          text(
            "Discuss the proposed changes with colleagues and agree a manageable first step.",
          ),
        ],
      },
      {
        id: "resources",
        contentPortableText: [
          text(
            "Check which existing resources can be adapted rather than starting again.",
          ),
        ],
      },
    ],
  })),
  {
    __typename: "NationalCurriculumInsightsPreparationSection",
    heading: "3 steps to get ready",
    steps: [
      {
        id: "understand",
        text: "Understand the proposed changes and identify what they mean for your curriculum.",
      },
      {
        id: "review",
        text: "Review the sequence with colleagues, including how new ideas connect to earlier learning.",
      },
      {
        id: "plan",
        text: "Plan a manageable first step and revisit it as more guidance becomes available.",
      },
    ],
    attribution: "A subject specialist",
    role: "Curriculum lead",
  },
];

export const sharedDownloadFixtureModules: NationalCurriculumInsightsModule[] =
  [
    {
      __typename: "NationalCurriculumInsightsConfidenceSection",
      heading: "Prepare with confidence using Oak",
      bodyPortableText: [
        text(
          "Explore the curriculum plans and resources to support your preparation. You can adapt them to your school's context.",
        ),
        text(
          "Keep using your existing plans while you review the proposed changes and agree what to prioritise.",
        ),
      ],
      cta: {
        label: "Explore curriculum plans",
        linkType: "external",
        external: "https://www.thenational.academy/teachers/curriculum",
      },
    },
    {
      __typename: "NationalCurriculumInsightsFaqSection",
      heading: "Frequently asked questions",
      items: [
        {
          question: "Where can I find more guidance?",
          answerPortableText: [
            text("", {
              children: [
                {
                  text: "Read the practical guidance page",
                  marks: ["guidance"],
                },
              ],
              markDefs: [
                {
                  _key: "guidance",
                  _type: "link",
                  href: "/curriculum-change-explained/guidance",
                },
              ],
            }),
          ],
        },
        {
          question: "Can I edit this document?",
          answerPortableText: [
            text(
              "Yes. The headings, paragraphs, lists and checklists remain editable in Word.",
            ),
          ],
        },
        {
          question: "How should I use the checklist?",
          answerPortableText: [
            text(
              "Use it to discuss the next steps with your team and record the actions you want to take.",
            ),
          ],
        },
      ],
    },
  ];

export const createDownloadFixture = (
  phase: NationalCurriculumInsightsPhase,
  stages: NationalCurriculumInsightsKeyStage[],
): NationalCurriculumInsightsSubject => {
  const title = stages.length ? "Science" : "Computing";
  let downloadLayout: "phase" | "singleKeyStage" | "keyStages" = "keyStages";
  if (stages.length === 0) downloadLayout = "phase";
  if (stages.length === 1) downloadLayout = "singleKeyStage";
  const phaseModules = [
    {
      __typename: "NationalCurriculumInsightsHeaderSection" as const,
      heading: "Internal phase editor title",
      bodyPortableText: [
        text(
          `Your guide to the national curriculum changes for ${phase} ${title.toLowerCase()}, including what's changing, what's staying the same and how to prepare.`,
        ),
      ],
      lastUpdatedAt: "2026-10-06",
    },
    ...(stages.length ? [headlines(phase)] : sections(phase)),
  ];
  return {
    id: `${title.toLowerCase()}-fixture`,
    pageType: "overview",
    title,
    summary: "Download test fixture",
    slug: title.toLowerCase(),
    curriculumSubjectSlugs: [title.toLowerCase()],
    modules: [headlines("overview")],
    tabs: [
      {
        kind: phase,
        label: phase,
        page: {
          id: `${title.toLowerCase()}-${phase}-fixture`,
          pageType: phase,
          downloadLayout,
          title: "Internal phase document title",
          summary: "Phase guidance summary",
          modules: phaseModules,
          expectedKeyStages: stages,
          keyStages: stages.map((keyStage) => ({
            keyStage,
            label: keyStage,
            page: {
              id: `${title.toLowerCase()}-${keyStage.toLowerCase()}-fixture`,
              pageType: "keyStage",
              keyStage,
              title: "Internal key-stage document title",
              summary: "Key-stage guidance summary",
              modules: sections(keyStage),
            },
          })),
        },
      },
    ],
  };
};
