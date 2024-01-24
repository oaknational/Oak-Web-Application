import { FC } from "react";
import { OakGrid, OakGridArea } from "@oak-academy/oak-components";

import HomeAboutCard from "./HomeAboutCard";
import HomeHelpCard from "./HomeHelpCard";

import { HomePage } from "@/common-lib/cms-types";
import useAnalytics from "@/context/Analytics/useAnalytics";
import PostList, {
  PostListProps,
} from "@/components/SharedComponents/PostList";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import OwaLink from "@/components/SharedComponents/OwaLink";
import Typography, { Heading } from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";

type SharedHomePageProps = {
  blogListProps: PostListProps;
  pageData: HomePage;
};

const SharedHomeContent: FC<SharedHomePageProps> = ({
  blogListProps,
  pageData,
}) => {
  const { track } = useAnalytics();
  const newsletterFormProps = useNewsletterForm({
    onSubmit: track.newsletterSignUpCompleted,
  });

  return (
    <>
      <Flex $background={"lemon50"} $justifyContent={"center"}>
        <MaxWidth $ph={[0, 12]} $mt={[80, 32]} $mb={64}>
          <OakGrid
            $cg={["space-between-s", "space-between-m2"]}
            $rg={["space-between-none", "space-between-m2"]}
            $mt={["space-between-s", "space-between-xxxl"]}
          >
            <OakGridArea $colSpan={[12, 4]} $order={[0, 0]}>
              <HomeAboutCard {...pageData.sidebarCard1} />
            </OakGridArea>
            <OakGridArea
              $mb={["space-between-xl", "space-between-none"]}
              $colSpan={[12, 4]}
              $order={[2, 1]}
            >
              <HomeHelpCard {...pageData.sidebarCard2} />
            </OakGridArea>
            <OakGridArea $colSpan={[12, 4]} $order={[4, 1]}>
              <NewsletterFormWrap
                {...newsletterFormProps}
                anchorTargetId="email-sign-up"
              />
            </OakGridArea>
            <OakGridArea
              $mb={["space-between-xl", "space-between-none"]}
              $colSpan={[12, 8]}
              $rowSpan={[3]}
              $order={[3, 0]}
            >
              <Box
                $background={"white"}
                $ph={[16, 24]}
                $pv={24}
                $height={"100%"}
              >
                <Flex
                  $width={"100%"}
                  $alignItems={["flex-start", "center"]}
                  $justifyContent="space-between"
                  $mb={48}
                  $flexDirection={["column", "row"]}
                >
                  <Heading $mb={[36, 0]} tag={"h2"} $font={"heading-5"}>
                    Stay up to date!
                  </Heading>
                  <Flex $flexDirection={"row"}>
                    <Typography $mr={16} $font="heading-7">
                      <OwaLink page={"webinar-index"}>All webinars</OwaLink>
                    </Typography>
                    <Typography $font="heading-7">
                      <OwaLink page={"blog-index"}>All blogs</OwaLink>
                    </Typography>
                  </Flex>
                </Flex>
                <PostList {...blogListProps} />
              </Box>
            </OakGridArea>
          </OakGrid>
        </MaxWidth>
      </Flex>
    </>
  );
};

export default SharedHomeContent;
