import * as z from "zod";

import { documentSchema, imageSchema, slugSchema } from "./base";
import { portableTextSchema } from "./portableText";

export const nationalCurriculumInsightsPhaseSchema = z.enum([
  "primary",
  "secondary",
]);

export type NationalCurriculumInsightsPhase = z.infer<
  typeof nationalCurriculumInsightsPhaseSchema
>;

export const nationalCurriculumInsightsKeyStageSchema = z.enum([
  "KS1",
  "KS2",
  "KS3",
  "KS4",
]);

export type NationalCurriculumInsightsKeyStage = z.infer<
  typeof nationalCurriculumInsightsKeyStageSchema
>;

export const nationalCurriculumInsightsKeyStageSlugSchema = z.enum([
  "key-stage-1",
  "key-stage-2",
  "key-stage-3",
  "key-stage-4",
]);

export type NationalCurriculumInsightsKeyStageSlug = z.infer<
  typeof nationalCurriculumInsightsKeyStageSlugSchema
>;

export const nationalCurriculumInsightsKeyStagesForPhase = {
  primary: ["KS1", "KS2"],
  secondary: ["KS3", "KS4"],
} as const satisfies Record<
  NationalCurriculumInsightsPhase,
  readonly NationalCurriculumInsightsKeyStage[]
>;

export const nationalCurriculumInsightsKeyStageSlug = (
  keyStage: NationalCurriculumInsightsKeyStage,
): NationalCurriculumInsightsKeyStageSlug =>
  `key-stage-${keyStage.slice(2)}` as NationalCurriculumInsightsKeyStageSlug;

export const nationalCurriculumInsightsKeyStageFromSlug = (
  slug: NationalCurriculumInsightsKeyStageSlug,
): NationalCurriculumInsightsKeyStage =>
  `KS${slug.slice("key-stage-".length)}` as NationalCurriculumInsightsKeyStage;

export const nationalCurriculumInsightsTabKindSchema = z.enum([
  "overview",
  "primary",
  "secondary",
]);

export type NationalCurriculumInsightsTabKind = z.infer<
  typeof nationalCurriculumInsightsTabKindSchema
>;

export const nationalCurriculumInsightsSubjectLookupParamsSchema = z.object({
  subjectSlug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

const nationalCurriculumInsightsTableSchema = z.object({
  rows: z.array(z.object({ cells: z.array(z.string()) })).min(1),
});

const nationalCurriculumInsightsHeroSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsHeroSection"),
  heading: z.string().min(1),
  bodyPortableText: portableTextSchema,
  image: imageSchema,
  authorName: z.string().min(1).nullable().optional(),
  authorRole: z.string().min(1).nullable().optional(),
  authorImage: imageSchema.nullable().optional(),
  statusMessage: z.string().min(1).nullable().optional(),
});

export type NationalCurriculumInsightsHeroSection = z.infer<
  typeof nationalCurriculumInsightsHeroSectionSchema
>;

const nationalCurriculumInsightsOverviewSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsOverviewSection"),
  heading: z.string().min(1),
  bodyPortableText: portableTextSchema,
  image: imageSchema,
});

const nationalCurriculumInsightsPhaseCardSchema = z.object({
  phase: nationalCurriculumInsightsPhaseSchema,
  heading: z.string().min(1),
  image: imageSchema.nullable().optional(),
  linkLabel: z.string().min(1),
});

const nationalCurriculumInsightsPhaseCardsSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsPhaseCardsSection"),
  cards: z.array(nationalCurriculumInsightsPhaseCardSchema).min(1).max(2),
});

const nationalCurriculumInsightsKeyStageCardSchema = z.object({
  keyStage: nationalCurriculumInsightsKeyStageSchema,
  heading: z.string().min(1),
  image: imageSchema.nullable().optional(),
  linkLabel: z.string().min(1),
});

const nationalCurriculumInsightsKeyStageCardsSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsKeyStageCardsSection"),
  cards: z.array(nationalCurriculumInsightsKeyStageCardSchema).min(1),
});

const nationalCurriculumInsightsPromotionalHeadingSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsPromotionalHeadingSection"),
  heading: z.string().min(1),
});

const nationalCurriculumInsightsSubjectNavigationSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsSubjectNavigationSection"),
  phases: z.array(nationalCurriculumInsightsPhaseSchema).min(1),
  primaryHeading: z.string().min(1),
  secondaryHeading: z.string().min(1),
});

const nationalCurriculumInsightsNewsletterSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsNewsletterSection"),
  heading: z.string().min(1),
  introduction: z.string().min(1),
  benefits: z.array(z.string().min(1)).min(1),
  illustration: imageSchema,
  privacyPortableText: portableTextSchema,
  formId: z.string().nullable().optional(),
  buttonLabel: z.string().min(1),
});

const nationalCurriculumInsightsFaqSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsFaqSection"),
  heading: z.string().min(1),
  items: z
    .array(
      z.object({
        question: z.string().min(1),
        answerPortableText: portableTextSchema,
        initiallyExpanded: z.boolean().nullable().optional(),
      }),
    )
    .min(1),
});

const nationalCurriculumInsightsRichTextSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsRichTextSection"),
  heading: z.string().min(1),
  contentPortableText: portableTextSchema,
});

const nationalCurriculumInsightsImageTextSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsImageTextSection"),
  heading: z.string().min(1),
  bodyPortableText: portableTextSchema,
  image: imageSchema,
  imagePosition: z.enum(["left", "right"]),
  background: z.enum(["white", "turquoise", "yellow"]),
  ctaLabel: z.string().min(1).nullable().optional(),
  ctaHref: z.string().min(1).nullable().optional(),
});

const nationalCurriculumInsightsVideoCardsSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsVideoCardsSection"),
  heading: z.string().min(1),
  introductionPortableText: portableTextSchema.nullable().optional(),
  cards: z
    .array(
      z.object({
        heading: z.string().min(1),
        description: z.string().min(1),
        image: imageSchema,
        videoUrl: z.url(),
        duration: z.string().min(1).nullable().optional(),
      }),
    )
    .min(1),
});

const nationalCurriculumInsightsQuoteSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsQuoteSection"),
  quote: z.string().min(1),
  attribution: z.string().min(1),
  role: z.string().min(1).nullable().optional(),
  image: imageSchema.nullable().optional(),
});

const nationalCurriculumInsightsTableSectionSchema = z.object({
  __typename: z.literal("NationalCurriculumInsightsTableSection"),
  heading: z.string().min(1),
  table: nationalCurriculumInsightsTableSchema,
});

export const nationalCurriculumInsightsModuleSchema = z.discriminatedUnion(
  "__typename",
  [
    nationalCurriculumInsightsHeroSectionSchema,
    nationalCurriculumInsightsOverviewSectionSchema,
    nationalCurriculumInsightsPhaseCardsSectionSchema,
    nationalCurriculumInsightsKeyStageCardsSectionSchema,
    nationalCurriculumInsightsPromotionalHeadingSectionSchema,
    nationalCurriculumInsightsSubjectNavigationSectionSchema,
    nationalCurriculumInsightsNewsletterSectionSchema,
    nationalCurriculumInsightsFaqSectionSchema,
    nationalCurriculumInsightsRichTextSectionSchema,
    nationalCurriculumInsightsImageTextSectionSchema,
    nationalCurriculumInsightsVideoCardsSectionSchema,
    nationalCurriculumInsightsQuoteSectionSchema,
    nationalCurriculumInsightsTableSectionSchema,
  ],
);

export type NationalCurriculumInsightsModule = z.infer<
  typeof nationalCurriculumInsightsModuleSchema
>;

const nationalCurriculumInsightsPageContentSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  modules: z.array(nationalCurriculumInsightsModuleSchema).min(1),
});

export const nationalCurriculumInsightsKeyStagePageSchema = z.object({
  pageType: z.literal("keyStage"),
  keyStage: nationalCurriculumInsightsKeyStageSchema,
  ...nationalCurriculumInsightsPageContentSchema.shape,
  ...documentSchema.shape,
});

const nationalCurriculumInsightsKeyStagePageReferenceSchema = z
  .object({
    keyStage: nationalCurriculumInsightsKeyStageSchema,
    label: z.string().min(1),
    page: nationalCurriculumInsightsKeyStagePageSchema,
  })
  .superRefine(({ keyStage, page }, context) => {
    if (page.keyStage !== keyStage) {
      context.addIssue({
        code: "custom",
        path: ["page", "keyStage"],
        message: "The referenced page key stage must match its entry",
      });
    }
  });

export const nationalCurriculumInsightsPageSchema = z
  .object({
    pageType: nationalCurriculumInsightsPhaseSchema,
    keyStages: z.array(nationalCurriculumInsightsKeyStagePageReferenceSchema),
    ...nationalCurriculumInsightsPageContentSchema.shape,
    ...documentSchema.shape,
  })
  .superRefine(({ id, keyStages, pageType }, context) => {
    if (
      new Set(keyStages.map(({ keyStage }) => keyStage)).size !==
      keyStages.length
    ) {
      context.addIssue({
        code: "custom",
        path: ["keyStages"],
        message: "Key stages must be unique within a phase",
      });
    }

    if (
      new Set(keyStages.map(({ page }) => page.id.replace(/^drafts\./, "")))
        .size !== keyStages.length
    ) {
      context.addIssue({
        code: "custom",
        path: ["keyStages"],
        message: "Every key stage must own a separate page",
      });
    }

    keyStages.forEach(({ keyStage }, index) => {
      if (
        !(
          nationalCurriculumInsightsKeyStagesForPhase[
            pageType
          ] as readonly string[]
        ).includes(keyStage)
      ) {
        context.addIssue({
          code: "custom",
          path: ["keyStages", index, "keyStage"],
          message: `${keyStage} is not valid below ${pageType}`,
        });
      }
    });

    if (!id) {
      context.addIssue({
        code: "custom",
        message: "A phase page requires a stable document id",
      });
    }
  });

export const nationalCurriculumInsightsPageSummarySchema = z.object({
  pageType: nationalCurriculumInsightsPhaseSchema,
  title: z.string().min(1),
  ...documentSchema.shape,
});

const refineSubjectTabs = <
  T extends {
    kind: NationalCurriculumInsightsPhase;
    page: { id: string; pageType: NationalCurriculumInsightsTabKind };
  },
>(
  tabs: T[],
  context: z.RefinementCtx,
) => {
  if (new Set(tabs.map(({ kind }) => kind)).size !== tabs.length) {
    context.addIssue({
      code: "custom",
      message: "Subject phases must be unique",
    });
  }

  if (new Set(tabs.map(({ page }) => page.id)).size !== tabs.length) {
    context.addIssue({
      code: "custom",
      message: "Each subject phase must have its own page",
    });
  }

  tabs.forEach((tab, index) => {
    if (tab.page.pageType !== tab.kind) {
      context.addIssue({
        code: "custom",
        path: [index, "page", "pageType"],
        message: "The referenced page type must match its tab",
      });
    }
  });
};

export const nationalCurriculumInsightsTabSchema = z.object({
  kind: nationalCurriculumInsightsPhaseSchema,
  label: z.string().min(1),
  page: nationalCurriculumInsightsPageSchema,
});

export const nationalCurriculumInsightsTabSummarySchema = z.object({
  kind: nationalCurriculumInsightsPhaseSchema,
  label: z.string().min(1),
  page: nationalCurriculumInsightsPageSummarySchema,
});

export const nationalCurriculumInsightsSubjectSchema = z.object({
  pageType: z.literal("overview"),
  title: z.string().min(1),
  summary: z.string().min(1),
  modules: z.array(nationalCurriculumInsightsModuleSchema).min(1),
  slug: slugSchema,
  curriculumSubjectSlugs: z.array(z.string().min(1)).min(1),
  tabs: z
    .array(nationalCurriculumInsightsTabSchema)
    .min(1)
    .max(2)
    .superRefine(refineSubjectTabs),
  ...documentSchema.shape,
});

export const nationalCurriculumInsightsSubjectSummarySchema = z.object({
  title: z.string().min(1),
  slug: slugSchema,
  curriculumSubjectSlugs: z.array(z.string().min(1)).min(1),
  tabs: z
    .array(nationalCurriculumInsightsTabSummarySchema)
    .min(1)
    .max(2)
    .superRefine(refineSubjectTabs),
  ...documentSchema.shape,
});

export const nationalCurriculumInsightsHubSchema = z
  .object({
    title: z.string().min(1),
    summary: z.string().min(1),
    subjects: z.array(nationalCurriculumInsightsSubjectSummarySchema).min(1),
    modules: z.array(nationalCurriculumInsightsModuleSchema).min(1),
    ...documentSchema.shape,
  })
  .superRefine(({ subjects }, context) => {
    const subjectIds = subjects.map(({ id }) => id.replace(/^drafts\./, ""));
    const subjectSlugs = subjects.map(({ slug }) => slug);
    const pageIds = subjects.flatMap(({ tabs }) =>
      tabs.map(({ page }) => page.id.replace(/^drafts\./, "")),
    );

    if (new Set(subjectIds).size !== subjectIds.length) {
      context.addIssue({
        code: "custom",
        path: ["subjects"],
        message: "Hub subjects must be unique",
      });
    }

    if (new Set(subjectSlugs).size !== subjectSlugs.length) {
      context.addIssue({
        code: "custom",
        path: ["subjects"],
        message: "Hub subject slugs must be unique",
      });
    }

    if (new Set(pageIds).size !== pageIds.length) {
      context.addIssue({
        code: "custom",
        path: ["subjects"],
        message: "Every subject phase must own a separate page",
      });
    }
  });

export type NationalCurriculumInsightsPage = z.infer<
  typeof nationalCurriculumInsightsPageSchema
>;
export type NationalCurriculumInsightsKeyStagePage = z.infer<
  typeof nationalCurriculumInsightsKeyStagePageSchema
>;
export type NationalCurriculumInsightsSubject = z.infer<
  typeof nationalCurriculumInsightsSubjectSchema
>;
export type NationalCurriculumInsightsHub = z.infer<
  typeof nationalCurriculumInsightsHubSchema
>;
