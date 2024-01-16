import { FC } from "react";

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
import OakLink from "@/components/OakLink";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
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
          <Grid $cg={[16, 32]} $rg={[0, 32]} $mt={[16, 80]}>
            <GridArea $colSpan={[12, 4]} $order={[0, 0]}>
              <HomeAboutCard {...pageData.sidebarCard1} />
            </GridArea>
            <GridArea $mb={[64, 0]} $colSpan={[12, 4]} $order={[2, 1]}>
              <HomeHelpCard {...pageData.sidebarCard2} />
            </GridArea>
            <GridArea $colSpan={[12, 4]} $order={[4, 1]}>
              <NewsletterFormWrap
                {...newsletterFormProps}
                anchorTargetId="email-sign-up"
              />
            </GridArea>
            <GridArea
              $mb={[64, 0]}
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
                      <OakLink page={"webinar-index"}>All webinars</OakLink>
                    </Typography>
                    <Typography $font="heading-7">
                      <OakLink page={"blog-index"}>All blogs</OakLink>
                    </Typography>
                  </Flex>
                </Flex>
                <PostList {...blogListProps} />
              </Box>
            </GridArea>
          </Grid>
        </MaxWidth>
      </Flex>
    </>
  );
};

export default SharedHomeContent;
