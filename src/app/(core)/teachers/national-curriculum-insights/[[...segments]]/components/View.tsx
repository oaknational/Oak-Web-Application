"use client";

import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  OakTabs,
} from "@oaknational/oak-components";

import type { NationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { NationalCurriculumInsightsHero } from "./Hero";
import { NationalCurriculumInsightsHeader } from "./InsightHeader";
import { NationalCurriculumInsightsDownload } from "./Download";
import { NationalCurriculumInsightsArticle } from "./Article";
import {
  NationalCurriculumInsightsConfidence,
  NationalCurriculumInsightsPreparation,
  NationalCurriculumInsightsChanges,
  NationalCurriculumInsightsUnchanged,
  NationalCurriculumInsightsChecklist,
  NationalCurriculumInsightsFaq,
  NationalCurriculumInsightsGuidanceIntro,
  NationalCurriculumInsightsImageText,
  NationalCurriculumInsightsKeyStageCards,
  NationalCurriculumInsightsNewsletter,
  NationalCurriculumInsightsOverview,
  NationalCurriculumInsightsPhaseCards,
  NationalCurriculumInsightsPromotionalHeading,
  NationalCurriculumInsightsQuote,
  NationalCurriculumInsightsRichText,
  NationalCurriculumInsightsSubjectNavigation,
  NationalCurriculumInsightsSubjectLinks,
  NationalCurriculumInsightsTable,
  NationalCurriculumInsightsVideoCards,
} from "./Sections";

import type { NationalCurriculumInsightsModule } from "@/common-lib/cms-types/nationalCurriculumInsights";
import { nationalCurriculumInsightsKeyStageSlug } from "@/common-lib/cms-types/nationalCurriculumInsights";
import {
  nationalCurriculumInsightsSubjectPhaseHref,
  nationalCurriculumInsightsSubjectPhaseKeyStageHref,
  nationalCurriculumInsightsTabHref,
} from "@/common-lib/urls/nationalCurriculumInsights";

const assertNever = (value: never): never => {
  throw new Error(`Unsupported National Curriculum Insights module: ${value}`);
};

type InsightTab = {
  active: boolean;
  href: string;
  label: string;
};

const ModuleView = ({
  module,
  data,
}: {
  module: NationalCurriculumInsightsModule;
  data: NationalCurriculumInsightsRouteData;
}) => {
  switch (module.__typename) {
    case "NationalCurriculumInsightsHeaderSection":
      return <NationalCurriculumInsightsHeader section={module} data={data} />;
    case "NationalCurriculumInsightsHeroSection":
      return <NationalCurriculumInsightsHero section={module} data={data} />;
    case "NationalCurriculumInsightsOverviewSection":
      return (
        <NationalCurriculumInsightsOverview section={module} data={data} />
      );
    case "NationalCurriculumInsightsPhaseCardsSection":
      return (
        <NationalCurriculumInsightsPhaseCards section={module} data={data} />
      );
    case "NationalCurriculumInsightsKeyStageCardsSection":
      return (
        <NationalCurriculumInsightsKeyStageCards section={module} data={data} />
      );
    case "NationalCurriculumInsightsPromotionalHeadingSection":
      return <NationalCurriculumInsightsPromotionalHeading section={module} />;
    case "NationalCurriculumInsightsPhaseNavigationSection":
      return <InsightsTabs section={module} data={data} />;
    case "NationalCurriculumInsightsSubjectNavigationSection":
      return (
        <NationalCurriculumInsightsSubjectNavigation
          section={module}
          data={data}
        />
      );
    case "NationalCurriculumInsightsSubjectLinksSection":
      return (
        <NationalCurriculumInsightsSubjectLinks section={module} data={data} />
      );
    case "NationalCurriculumInsightsNewsletterSection":
      return (
        <NationalCurriculumInsightsNewsletter
          section={module}
          variant={
            data.route.kind === "hub" || data.route.kind === "guidance"
              ? "plain"
              : "highlighted"
          }
        />
      );
    case "NationalCurriculumInsightsFaqSection":
      return <NationalCurriculumInsightsFaq section={module} data={data} />;
    case "NationalCurriculumInsightsChangesSection":
      return <NationalCurriculumInsightsChanges section={module} />;
    case "NationalCurriculumInsightsUnchangedSection":
      return <NationalCurriculumInsightsUnchanged section={module} />;
    case "NationalCurriculumInsightsChecklistSection":
      return (
        <NationalCurriculumInsightsChecklist
          section={module}
          variant={data.activeKeyStage ? "keyStage" : "phase"}
        />
      );
    case "NationalCurriculumInsightsPreparationSection":
      return (
        <NationalCurriculumInsightsPreparation
          section={module}
          variant={data.activeKeyStage ? "keyStage" : "phase"}
        />
      );
    case "NationalCurriculumInsightsConfidenceSection":
      return <NationalCurriculumInsightsConfidence section={module} />;
    case "NationalCurriculumInsightsArticleSection": {
      const phase = data.subject?.tabs.find(
        ({ kind }) => kind === data.activeTab,
      )?.label;
      const heading = [
        data.activeKeyStage ?? phase,
        data.subject?.title ?? data.page?.title,
      ]
        .filter(Boolean)
        .join(" ");
      const hasDownload =
        [...(data.page?.modules ?? []), ...(data.hub?.modules ?? [])].some(
          ({ __typename }) =>
            __typename === "NationalCurriculumInsightsDownloadSection",
        ) && data.subjects.some(({ tabs }) => tabs.length > 0);
      return (
        <NationalCurriculumInsightsArticle
          heading={heading}
          hasDownload={hasDownload}
          sections={module.sections.map((section) => ({
            id: `insights-${section.id}`,
            label: section.navigationLabel ?? section.heading,
            content: <ModuleView module={section} data={data} />,
          }))}
        />
      );
    }
    case "NationalCurriculumInsightsRichTextSection":
      return <NationalCurriculumInsightsRichText section={module} />;
    case "NationalCurriculumInsightsImageTextSection":
      return (
        <NationalCurriculumInsightsImageText section={module} data={data} />
      );
    case "NationalCurriculumInsightsGuidanceIntroSection":
      return <NationalCurriculumInsightsGuidanceIntro section={module} />;
    case "NationalCurriculumInsightsVideoCardsSection":
      return <NationalCurriculumInsightsVideoCards section={module} />;
    case "NationalCurriculumInsightsQuoteSection":
      return <NationalCurriculumInsightsQuote section={module} />;
    case "NationalCurriculumInsightsTableSection":
      return <NationalCurriculumInsightsTable section={module} />;
    case "NationalCurriculumInsightsDownloadSection":
      if (!data.subjects.some(({ tabs }) => tabs.length > 0)) return null;
      return (
        <NationalCurriculumInsightsDownload section={module} data={data} />
      );
    default:
      return assertNever(module);
  }
};

const ModuleList = ({
  data,
  modules,
  summary,
  title,
}: {
  data: NationalCurriculumInsightsRouteData;
  modules: NationalCurriculumInsightsModule[];
  summary: string;
  title: string;
}) => (
  <>
    {modules.some(
      ({ __typename }) =>
        __typename === "NationalCurriculumInsightsHeroSection",
    ) ? null : (
      <OakBox
        $mh="auto"
        $maxWidth="spacing-1280"
        $ph={["spacing-16", "spacing-32"]}
        $pv={["spacing-24", "spacing-48"]}
      >
        <OakHeading tag="h1" $font={["heading-4", "heading-2"]}>
          {title}
        </OakHeading>
        <OakP>{summary}</OakP>
      </OakBox>
    )}
    {modules.map((module, index) => (
      <ModuleView
        key={`${module.__typename}-${index}`}
        module={module}
        data={data}
      />
    ))}
  </>
);

const PageModuleList = ({
  data,
}: {
  data: NationalCurriculumInsightsRouteData;
}) => {
  if (!data.page) {
    return null;
  }

  const heroIndex = data.page.modules.findIndex(
    ({ __typename }) =>
      __typename === "NationalCurriculumInsightsHeaderSection",
  );
  const hero = heroIndex >= 0 ? data.page.modules[heroIndex] : null;
  const modules = data.page.modules.filter((_, index) => index !== heroIndex);
  const sharedDownload = data.hub?.modules.find(
    ({ __typename }) =>
      __typename === "NationalCurriculumInsightsDownloadSection",
  );
  const hasPageDownload = modules.some(
    ({ __typename }) =>
      __typename === "NationalCurriculumInsightsDownloadSection",
  );

  return (
    <>
      {hero ? (
        <ModuleView module={hero} data={data} />
      ) : (
        <OakBox
          $mh="auto"
          $maxWidth="spacing-1280"
          $ph={["spacing-16", "spacing-32"]}
          $pv={["spacing-24", "spacing-48"]}
        >
          <OakHeading tag="h1" $font={["heading-4", "heading-2"]}>
            {data.page.title}
          </OakHeading>
          <OakP>{data.page.summary}</OakP>
        </OakBox>
      )}
      {modules.map((module, index) => {
        return (
          <ModuleView
            key={`${module.__typename}-${index}`}
            module={module}
            data={data}
          />
        );
      })}
      {!hasPageDownload && sharedDownload ? (
        <ModuleView module={sharedDownload} data={data} />
      ) : null}
    </>
  );
};

const InsightsTabs = ({
  section,
  data,
}: {
  section: Extract<
    NationalCurriculumInsightsModule,
    { __typename: "NationalCurriculumInsightsPhaseNavigationSection" }
  >;
  data: NationalCurriculumInsightsRouteData;
}) => {
  if (!data.subject || !data.activeTab) {
    return null;
  }

  const isSubjectOverview = data.activeTab === "overview";
  const phaseTab = isSubjectOverview
    ? null
    : data.subject.tabs.find(({ kind }) => kind === data.activeTab);
  let tabs: InsightTab[];
  if (isSubjectOverview || phaseTab?.page.keyStages.length === 0) {
    tabs = [
      {
        active: isSubjectOverview,
        href: nationalCurriculumInsightsTabHref(data.subject.slug, "overview"),
        label: `${data.subject.title} ${section.overviewLabel}`,
      },
      ...data.subject.tabs.map(({ kind }) => ({
        active: data.activeTab === kind,
        href: nationalCurriculumInsightsTabHref(data.subject!.slug, kind),
        label: `${data.subject!.title} ${
          kind === "primary" ? section.primaryLabel : section.secondaryLabel
        } changes`,
      })),
    ];
  } else if (phaseTab) {
    tabs = [
      {
        active: data.activeKeyStage === null,
        href: nationalCurriculumInsightsSubjectPhaseHref(
          data.subject.slug,
          phaseTab.kind,
        ),
        label: `${phaseTab.label} ${data.subject.title} ${section.overviewLabel}`,
      },
      ...phaseTab.page.keyStages.map(({ keyStage }) => ({
        active: data.activeKeyStage === keyStage,
        href: nationalCurriculumInsightsSubjectPhaseKeyStageHref(
          data.subject!.slug,
          phaseTab.kind,
          nationalCurriculumInsightsKeyStageSlug(keyStage),
        ),
        label: `${data.subject!.title} ${phaseTab.label} - ${keyStage} changes`,
      })),
    ];
  } else {
    tabs = [];
  }
  const activeLabel = tabs.find(({ active }) => active)?.label;

  if (!activeLabel || tabs.length === 0) {
    return null;
  }

  return (
    <OakBox
      $width="100%"
      $maxWidth="spacing-1280"
      $boxSizing="border-box"
      $overflowX="auto"
      as="nav"
      aria-label={`${data.subject.title} insights`}
      $mh="auto"
      $ph={["spacing-20", "spacing-0"]}
      $pv={["spacing-24", "spacing-64"]}
    >
      <OakTabs
        sizeVariant="default"
        colorVariant="black"
        activeTab={activeLabel}
        tabs={tabs.map(({ href, label }) => ({
          href,
          label,
          type: "link" as const,
        }))}
      />
    </OakBox>
  );
};

export const NationalCurriculumInsightsView = ({
  data,
}: {
  data: NationalCurriculumInsightsRouteData;
}) => {
  if (data.route.kind === "hub" && data.hub) {
    return (
      <OakBox as="main" $color="text-primary">
        <ModuleList
          data={data}
          modules={data.hub.modules}
          title={data.hub.title}
          summary={data.hub.summary}
        />
      </OakBox>
    );
  }

  if (data.route.kind === "guidance" && data.page) {
    return (
      <OakFlex as="main" $color="text-primary" $flexDirection="column">
        <ModuleList
          data={data}
          modules={data.page.modules}
          title={data.page.title}
          summary={data.page.summary}
        />
      </OakFlex>
    );
  }

  if (!data.page) {
    return null;
  }

  return (
    <OakBox as="main" $color="text-primary">
      <PageModuleList data={data} />
    </OakBox>
  );
};
