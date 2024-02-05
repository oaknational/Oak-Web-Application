import { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";

import AppLayout from "@/components/SharedComponents/AppLayout";
import Box from "@/components/SharedComponents/Box/Box";
import curriculumPreviousDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumPreviousDownloads.fixture";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Flex from "@/components/SharedComponents/Flex/Flex";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import TabularNav from "@/components/SharedComponents/TabularNav";
import Heading from "@/components/SharedComponents/Typography/Heading";
import Icon from "@/components/SharedComponents/Icon/Icon";
import Hr from "@/components/SharedComponents/Typography/Hr";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import P from "@/components/SharedComponents/Typography/P";
import { ButtonAsLinkProps } from "@/components/SharedComponents/Button/ButtonAsLink";
import {
  CurriculumDownload,
  CurriculumDownloads,
} from "@/components/CurriculumComponents/CurriculumDownloads/CurriculumDownloads";
import DropdownSelect from "@/components/GenericPagesComponents/DropdownSelect";

const CurriculumPreviousDownloadsPage: NextPage = () => {
  const data = curriculumPreviousDownloadsFixture();
  const [activeTab, setActiveTab] = useState<string>("EYFS");
  type Document = (typeof data)["documents"][0];

  const categoryDocuments = useMemo(() => {
    const documents: { [key: string]: Document[] } = {};
    data.documents.forEach((document) => {
      const documentsArray = documents[document.category] || [];
      documentsArray.push(document);
      documents[document.category] = documentsArray;
    });
    return documents;
  }, [data.documents]);

  useEffect(() => {
    const hashTab = window.location.hash.slice(1);
    if (hashTab && categoryDocuments[hashTab]) {
      setActiveTab(hashTab);
    }
  }, [categoryDocuments]);

  const updateTab = (category: string) => {
    setActiveTab(category);
    const newUrl = `#${category}`;
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl,
    );
  };

  const downloads: CurriculumDownload[] = [];
  const links: ButtonAsLinkProps[] = [];
  for (const category of Object.keys(categoryDocuments)) {
    if (category == activeTab) {
      categoryDocuments[category]?.forEach((document) => {
        downloads.push({
          label: document.subject,
          url: `https://api.thenational.academy/api/download-asset?type=curriculum-map&id=${document.slug}&extension=pdf`,
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
      <Box $background={"mint"} $pt={[20]}>
        <Box $maxWidth={1280} $mh={"auto"} $ph={28} $pb={56} $width={"100%"}>
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
                label: "Previous Downloads",
                disabled: true,
              },
            ]}
          />
          <Hr $color={"white"} />
          <Flex>
            <Box
              $background={"mint30"}
              $mr={12}
              $mv={"auto"}
              $position={"relative"}
            >
              <BrushBorders color="mint30" />
              <Icon
                name={"download"}
                $color="black"
                $width={140}
                $height={140}
                data-testid="icon"
              />
            </Box>
            <Box $ml={32}>
              <Heading
                tag={"h1"}
                $font={["heading-4", "heading-3"]}
                $mb={24}
                data-testid="curriculum-heading"
              >
                Previously released curricula
              </Heading>
              <Box $maxWidth={720}>
                <P $font="body-1">
                  Download our curricula from previous academic years to explore
                  our curriculum sequences, lesson information and the
                  curriculum principles that underpin them.
                </P>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>

      <Box $background={"mint30"}>
        <Box
          $display={["block", "none", "none"]}
          $maxWidth={1280}
          $mh={"auto"}
          $ph={28}
          $pv={24}
          $width={"100%"}
        >
          <DropdownSelect
            id={"select-category"}
            name={"select-category"}
            onChange={(event) => updateTab(event.target.value)}
            placeholder="Placeholder"
            data-testid="dropdownSelect"
            label="Select a category:"
            listItems={Object.keys(categoryDocuments).map((category) => ({
              value: category,
              label: category,
            }))}
            selectedValue={activeTab}
            $zIndex={"dropdownMenu"}
          />
        </Box>
        <Box
          $display={["none", "block", "block"]}
          $maxWidth={1280}
          $mh={"auto"}
          $width={"100%"}
          $ph={28}
          $pt={32}
        >
          <P $color="grey80" $font="heading-7" $mb={20}>
            Select a category:
          </P>
          <TabularNav
            $font={"heading-6"}
            $maxWidth={1280}
            $mh={"auto"}
            label="Curriculum Selection"
            links={links}
            data-testid="tabularNav"
          />
        </Box>
      </Box>

      <CurriculumDownloads category={activeTab} downloads={downloads} />
    </AppLayout>
  );
};

export default CurriculumPreviousDownloadsPage;
