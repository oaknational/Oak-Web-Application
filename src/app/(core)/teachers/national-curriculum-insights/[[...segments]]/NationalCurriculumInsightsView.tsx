"use client";

import { OakBox, OakHeading, OakP, OakTabs } from "@oaknational/oak-components";
import styled from "styled-components";

import { NationalCurriculumInsightsHero } from "./NationalCurriculumInsightsHero";
import {
  NationalCurriculumInsightsFaq,
  NationalCurriculumInsightsImageText,
  NationalCurriculumInsightsKeyStageCards,
  NationalCurriculumInsightsNewsletter,
  NationalCurriculumInsightsOverview,
  NationalCurriculumInsightsPhaseCards,
  NationalCurriculumInsightsPromotionalHeading,
  NationalCurriculumInsightsQuote,
  NationalCurriculumInsightsRichText,
  NationalCurriculumInsightsSubjectNavigation,
  NationalCurriculumInsightsTable,
  NationalCurriculumInsightsVideoCards,
} from "./NationalCurriculumInsightsSections";
import type { NationalCurriculumInsightsRouteData } from "./getNationalCurriculumInsightsData";

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

const TabsScroller = styled(OakBox)`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
`;

const ModuleView = ({
  module,
  data,
}: {
  module: NationalCurriculumInsightsModule;
  data: NationalCurriculumInsightsRouteData;
}) => {
  switch (module.__typename) {
    case "NationalCurriculumInsightsHeroSection":
      return <NationalCurriculumInsightsHero section={module} data={data} />;
    case "NationalCurriculumInsightsOverviewSection":
      return <NationalCurriculumInsightsOverview section={module} />;
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
    case "NationalCurriculumInsightsSubjectNavigationSection":
      return (
        <NationalCurriculumInsightsSubjectNavigation
          section={module}
          data={data}
        />
      );
    case "NationalCurriculumInsightsNewsletterSection":
      return <NationalCurriculumInsightsNewsletter section={module} />;
    case "NationalCurriculumInsightsFaqSection":
      return <NationalCurriculumInsightsFaq section={module} data={data} />;
    case "NationalCurriculumInsightsRichTextSection":
      return <NationalCurriculumInsightsRichText section={module} />;
    case "NationalCurriculumInsightsImageTextSection":
      return <NationalCurriculumInsightsImageText section={module} />;
    case "NationalCurriculumInsightsVideoCardsSection":
      return <NationalCurriculumInsightsVideoCards section={module} />;
    case "NationalCurriculumInsightsQuoteSection":
      return <NationalCurriculumInsightsQuote section={module} />;
    case "NationalCurriculumInsightsTableSection":
      return <NationalCurriculumInsightsTable section={module} />;
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
    ({ __typename }) => __typename === "NationalCurriculumInsightsHeroSection",
  );
  const hero = heroIndex >= 0 ? data.page.modules[heroIndex] : null;
  const modules = data.page.modules.filter((_, index) => index !== heroIndex);

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
      <InsightsTabs data={data} />
      {modules.map((module, index) => (
        <ModuleView
          key={`${module.__typename}-${index}`}
          module={module}
          data={data}
        />
      ))}
    </>
  );
};

const InsightsTabs = ({
  data,
}: {
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
  if (isSubjectOverview) {
    tabs = [
      {
        active: true,
        href: nationalCurriculumInsightsTabHref(data.subject.slug, "overview"),
        label: `${data.subject.title} changes overview`,
      },
      ...data.subject.tabs.map(({ kind, label }) => ({
        active: false,
        href: nationalCurriculumInsightsTabHref(data.subject!.slug, kind),
        label: `${data.subject!.title} ${label} changes`,
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
        label: `${phaseTab.label} ${data.subject.title} changes overview`,
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
    <TabsScroller
      as="nav"
      aria-label={`${data.subject.title} insights`}
      $mh="auto"
      $maxWidth="spacing-1280"
      $ph={["spacing-16", "spacing-32"]}
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
    </TabsScroller>
  );
};

export const NationalCurriculumInsightsView = ({
  data,
}: {
  data: NationalCurriculumInsightsRouteData;
}) => {
  if (data.route.kind === "hub") {
    return (
      <OakBox as="main">
        <ModuleList
          data={data}
          modules={data.hub.modules}
          title={data.hub.title}
          summary={data.hub.summary}
        />
      </OakBox>
    );
  }

  if (!data.page) {
    return null;
  }

  return (
    <OakBox as="main">
      <PageModuleList data={data} />
    </OakBox>
  );
};
