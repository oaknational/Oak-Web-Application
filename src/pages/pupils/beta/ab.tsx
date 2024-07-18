import { OakFlex, OakHeading, OakSpan } from "@oaknational/oak-components";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

export type BetaABPageProps = {
  variant: string | boolean | undefined;
};

const ABData = () => {
  const [variantKey, setVariantKey] = useState<string | boolean | undefined>();

  const posthog = usePostHog();

  useEffect(() => {
    const flag = posthog.featureFlags.getFeatureFlag("pupil-ab-dev");
    setVariantKey(flag);
  }, [setVariantKey, posthog]);

  if (variantKey === "variant-design-dev") {
    // Do something differently for this user
    return (
      <OakFlex
        $background={"lemon"}
        $width={"100vw"}
        $height={"100vh"}
        $flexDirection={"column"}
        $alignItems={"center"}
        $justifyContent={"center"}
      >
        <OakHeading tag="h1">Pupil Beta AB experiment</OakHeading>
        <OakHeading tag="h2">Variant version</OakHeading>
        <OakSpan>Design variant - {variantKey}</OakSpan>
      </OakFlex>
    );
  } else {
    // It's a good idea to let control variant always be the default behaviour,
    // so if something goes wrong with flag evaluation, you don't break your app.
    return (
      <OakFlex
        $background={"mint"}
        $width={"100vw"}
        $height={"100vh"}
        $flexDirection={"column"}
        $alignItems={"center"}
        $justifyContent={"center"}
      >
        <OakHeading tag="h1">Pupil Beta AB experiment</OakHeading>
        <OakHeading tag="h2">Default version</OakHeading>
        <OakSpan>Design variant - {variantKey}</OakSpan>
      </OakFlex>
    );
  }
};

const BetaAb = () => {
  return <ABData />;
};

// export const getServerSideProps = async (context) => {
//   const getVariant = () =>
//     new Promise((resolve) =>
//       setTimeout(
//         () =>
//           Math.random() > 0.5 ? resolve("variant-design") : resolve("control"),
//         1000,
//       ),
//     );

//   const variant = await getVariant();

//   return {
//     props: {
//       variant,
//     },
//   };
// };

export default BetaAb;
