import { OakFlex, OakHeading } from "@oaknational/oak-components";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useEffect } from "react";

import getPageProps from "@/node-lib/getPageProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

const OnboardingPage: NextPage = () => {
  const ffEnabled = useFeatureFlagEnabled("use-auth-owa");
  const router = useRouter();

  useEffect(() => {
    if (ffEnabled === false) {
      router.replace("/404");
    }
  }, [ffEnabled, router]);

  return ffEnabled ? (
    <AppLayout
      seoProps={{ ...getSeoProps({}), ...{ noFollow: true, noIndex: true } }}
      $background="white"
    >
      <OakFlex $flexDirection="column" $gap="all-spacing-10">
        <OakHeading tag="h1">Onboarding</OakHeading>
      </OakFlex>
    </AppLayout>
  ) : null;
};

export const getStaticProps: GetStaticProps = async (context) => {
  return getPageProps({
    page: "onboarding-page::getStaticProps",
    context,
    getProps: async () => {
      return {
        props: {},
      };
    },
  });
};

export default OnboardingPage;
