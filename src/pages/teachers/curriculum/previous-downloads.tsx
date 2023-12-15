import { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";

import AppLayout from "@/components/AppLayout/AppLayout";
import Box from "@/components/Box/Box";
import curriculumPreviousDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumPreviousDownloads.fixture";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Flex from "@/components/Flex/Flex";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import TabularNav from "@/components/TabularNav/TabularNav";
import Heading from "@/components/Typography/Heading";
import Icon from "@/components/Icon/Icon";
import Hr from "@/components/Typography/Hr";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders";
import P from "@/components/Typography/P";
import { ButtonAsLinkProps } from "@/components/Button/ButtonAsLink";
import { CurriculumDownloads } from "@/components/pages/Curriculum/CurriculumDownloads/CurriculumDownloads";

const CurriculumPreviousDownloadsPage: NextPage = () => {
  const data = curriculumPreviousDownloadsFixture();
  const [activeTab, setActiveTab] = useState<string>("EYFS");
  type Document = (typeof data)["documents"][0];
  type Download = {
    exists: true;
    type: "curriculum-pdf";
    label: string;
    ext: "pdf";
  };

  const categoryDocuments = useMemo(() => {
    const documents: { [key: string]: Document[] } = {};
    data.documents.forEach((document) => {
      document.categories.forEach((category) => {
        const documentsArray = documents[category] || [];
        documentsArray.push(document);
        documents[category] = documentsArray;
      });
    });
    return documents;
  }, [data.documents]);

  useEffect(() => {
    const hashTab = window.location.hash.slice(1);
    if (hashTab && categoryDocuments[hashTab]) {
      setActiveTab(hashTab);
    }
  }, [categoryDocuments]);

  const downloads: Download[] = [];
  const links: ButtonAsLinkProps[] = [];
  for (const category of Object.keys(categoryDocuments)) {
    if (category == activeTab) {
      categoryDocuments[category]?.forEach((document) => {
        downloads.push({
          type: "curriculum-pdf",
          exists: true,
          label: document.subject,
          ext: "pdf",
        });
      });
    }
    links.push({
      label: category,
      page: "curriculum-previous-downloads",
      isCurrent: activeTab == category,
      currentStyles: ["underline"],
      scroll: false,
      category: category,
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
                  category: "",
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

      <Box $background={"mint30"} $pt={[32]}>
        <Box $maxWidth={1280} $mh={"auto"} $width={"100%"} $ph={28} $pt={1}>
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

// TODO: Determine if ISR is needed for this page
// export type URLParams = {
//   category: string;
// };
// export const getStaticPaths = async () => {
//   if (shouldSkipInitialBuild) {
//     return getFallbackBlockingConfig();
//   }

//   const config: GetStaticPathsResult<URLParams> = {
//     fallback: "blocking",
//     paths: [],
//   };
//   return config;
// };

export default CurriculumPreviousDownloadsPage;
