import { GetServerSideProps } from "next";
import { OakFlex, OakHeading, OakSpan } from "@oaknational/oak-components";

import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";

const posthogApiKey = getBrowserConfig("posthogApiKey");

type PageProps = {
  variantKey: string | boolean | undefined;
};

/**
 *
 * This page demonstrates how to configure AB testing with posthog using a server-side implementation.
 *
 *
 */

const Page = (props: PageProps) => {
  const background = props.variantKey === "test" ? "lemon" : "mint";

  return (
    <OakFlex
      $background={background}
      $width={"100vw"}
      $height={"100vh"}
      $flexDirection={"column"}
      $alignItems={"center"}
      $justifyContent={"center"}
      $gap={"all-spacing-2"}
    >
      <OakHeading tag="h1">Server Side Rendered Page</OakHeading>
      <OakSpan>Variant Key: {props.variantKey}</OakSpan>
    </OakFlex>
  );
};

export const getServerSideProps = (async (context) => {
  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    posthogApiKey,
  );

  let variantKey: string | boolean | undefined;

  if (posthogUserId) {
    // get the variant key for the user
    variantKey = await getFeatureFlag({
      featureFlagKey: "pupil-server-side-render-demo",
      posthogUserId,
    });
  }

  return {
    props: { variantKey },
  };
}) satisfies GetServerSideProps<{ variantKey: string | boolean | undefined }>;

export default Page;
