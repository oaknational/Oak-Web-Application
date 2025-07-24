import assert from "assert";

import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakIcon,
  OakBox,
  OakHandDrawnHR,
} from "@oaknational/oak-components";

import AppLayout from "@/components/SharedComponents/AppLayout";
import curriculumPreviousDownloadsFixture, {
  DOWNLOAD_CATEGORIES,
  DownloadCategory,
} from "@/node-lib/curriculum-api-2023/fixtures/curriculumPreviousDownloads.fixture";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import TabularNav from "@/components/SharedComponents/TabularNav";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import { ButtonAsLinkProps } from "@/components/SharedComponents/Button/ButtonAsLink";
import CurriculumDownloads, {
  CurriculumDownload,
  CurriculumDownloadsRef,
} from "@/components/CurriculumComponents/CurriculumDownloads/CurriculumDownloads";
import DropdownSelect from "@/components/GenericPagesComponents/DropdownSelect";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const CurriculumPreviousDownloadsPage: NextPage = () => {
  const router = useRouter();
  const data = curriculumPreviousDownloadsFixture();
  const [activeTab, setActiveTab] = useState<DownloadCategory>("EYFS");
  const downloadsRef = useRef<CurriculumDownloadsRef>(null);
  type Document = (typeof data)["documents"][0];

  const categoryDocuments = useMemo(() => {
    const documents: { [key in DownloadCategory]?: Document[] } = {};
    data.documents.forEach((document) => {
      const documentsArray = documents[document.category] || [];
      documentsArray.push(document);
      documents[document.category] = documentsArray;
    });
    return documents;
  }, [data.documents]);

  const assertIsDownloadCategory = (input: string) => {
    const category = DOWNLOAD_CATEGORIES.find((c) => c === input);
    assert(category);
    return category;
  };

  const updateTab = (categoryRaw: string) => {
    const category = assertIsDownloadCategory(categoryRaw);
    setActiveTab(category);
    const newUrl = `${window.location.pathname}#${category}`;
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl,
    );
    delete router.query.keystage;
    downloadsRef.current?.clearSelection();
  };

  const downloads: CurriculumDownload[] = [];
  const links: ButtonAsLinkProps[] = [];
  const LEGACY_DOWNLOADS_API_URL = getBrowserConfig("vercelApiUrl");

  for (const category of Object.keys(categoryDocuments) as DownloadCategory[]) {
    if (category == activeTab) {
      categoryDocuments[category as DownloadCategory]?.forEach((document) => {
        downloads.push({
          label: document.subject,
          url: `${LEGACY_DOWNLOADS_API_URL}/api/download-asset?type=curriculum-map&extension=pdf&id=${document.slug}`,
          icon: document.icon,
        });
      });
    }
    links.push({
      label: category,
      page: "curriculum-previous-downloads",
      isCurrent: activeTab == category,
      currentStyles: ["underline"],
      scroll: false,
      onClick: (event) => {
        event.preventDefault();
        updateTab(category);
      },
    });
  }

  useEffect(() => {
    const keystage = router.query.keystage as string;
    const hashTab = (keystage?.toUpperCase() ||
      window.location.hash.slice(1)) as DownloadCategory;
    if (hashTab && categoryDocuments[hashTab]) {
      setActiveTab(hashTab);
    }
  }, [categoryDocuments, router.query.keystage]);

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: "Curriculum Previous Downloads",
          description: "Curriculum Previous Downloads",
        }),
      }}
      $background={"white"}
    >
      <OakBox $background={"mint"} $pt="inner-padding-l">
        <OakBox
          $maxWidth={"all-spacing-24"}
          $mh={"auto"}
          $ph={"inner-padding-xl"}
          $pb={"inner-padding-xl5"}
          $width={"100%"}
          data-testid="breadcrumbsContainer"
        >
          <Breadcrumbs
            breadcrumbs={[
              {
                oakLinkProps: {
                  page: "home",
                },
                label: "Home",
              },
              {
                oakLinkProps: {
                  page: "curriculum-landing-page",
                },
                label: "Curriculum resources",
              },
              {
                oakLinkProps: {
                  page: "curriculum-previous-downloads",
                },
                label: "Previous downloads",
                disabled: true,
              },
            ]}
          />

          <OakHandDrawnHR
            hrColor={"white"}
            $height={"all-spacing-05"}
            $mv={"space-between-m"}
          />
          <OakFlex>
            <OakBox
              $background={"mint30"}
              $mr={"space-between-xs"}
              $mv={"auto"}
              $position={"relative"}
            >
              <BrushBorders color="mint30" />
              <OakIcon
                iconName={"download"}
                $width={"all-spacing-16"}
                $height={"all-spacing-16"}
                data-testid="icon"
              />
            </OakBox>
            <OakBox $ml="space-between-m2">
              <OakHeading
                tag={"h1"}
                $font={["heading-4", "heading-3"]}
                $mb={"space-between-m"}
                data-testid="heading1"
              >
                Previously released curricula
              </OakHeading>
              <OakBox $maxWidth={"all-spacing-22"}>
                <OakP $font="body-1" data-testid="description">
                  Download our curricula from previous academic years to explore
                  our curriculum sequences, lesson information and the
                  curriculum principles that underpin them.
                </OakP>
              </OakBox>
            </OakBox>
          </OakFlex>
        </OakBox>
      </OakBox>

      <OakBox $background={"mint30"}>
        <OakBox
          $display={["block", "none", "none"]}
          $maxWidth={"all-spacing-24"}
          $mh={"auto"}
          $ph={"inner-padding-xl"}
          $pv={"inner-padding-xl"}
          $width={"100%"}
        >
          <DropdownSelect
            id={"select-category"}
            name={"select-category"}
            onChange={(event) => updateTab(event.target.value)}
            placeholder="Placeholder"
            data-testid="dropdownNav"
            label="Select a category:"
            listItems={Object.keys(categoryDocuments).map((category) => ({
              value: category,
              label: category,
            }))}
            selectedValue={activeTab}
            $zIndex={"dropdownMenu"}
          />
        </OakBox>
        <OakBox
          $display={["none", "block", "block"]}
          $maxWidth={"all-spacing-24"}
          $mh={"auto"}
          $width={"100%"}
          $ph={"inner-padding-xl2"}
          $pt={"inner-padding-xl2"}
        >
          <OakP $color="grey70" $font="heading-7" $mb={"space-between-m"}>
            Select a category:
          </OakP>
          <TabularNav
            $font={"heading-6"}
            $maxWidth={1280}
            $mh={"auto"}
            label="Curriculum Selection"
            links={links}
            data-testid="tabularNav"
          />
        </OakBox>
      </OakBox>

      <CurriculumDownloads
        category={activeTab}
        downloads={downloads}
        ref={downloadsRef}
      />
    </AppLayout>
  );
};

export default CurriculumPreviousDownloadsPage;
