import { FC } from "react";
import { useRouter } from "next/router";
import { OakSpan, OakFlex } from "@oaknational/oak-components";

import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import CopyLinkButton from "@/components/SharedComponents/Button/CopyLinkButton";

/**
 * A small toast-like banner in the bottom left corner to inform
 * users they're viewing the site in preview mode
 */
const LayoutPreviewControls: FC = () => {
  const router = useRouter();
  const secretParam = router.query.secret;

  let previewURL;
  if (typeof window !== "undefined") {
    /**
     * To trigger preview mode the user has to navigate to `/api/preview/$thePath?secret=$previewSecret`
     * This link construction relies on the user currently being in preview mode and having the ?secret=
     * query param in the URL.
     *
     * The preview secret should only be accessible server side so we can't read it from the env in
     * the context of this component. In future if this turns out to be a problem, we can pass it securely
     * via cookie with `res.setPreviewData({ previewSecret  })` within the API endpoint, however passing
     * it to this component would require changes to every single CMS-controlled page's getStaticProps.
     */
    const currentUrl = new URL(window.location.href);
    currentUrl.pathname = `/api/preview${currentUrl.pathname}`;
    previewURL = currentUrl.toString();
  }

  return (
    <OakFlex
      $position="fixed"
      $bottom="spacing-20"
      $left="spacing-20"
      $pa="spacing-4"
      $alignItems="center"
      $color="black"
      $background="white"
    >
      <OakSpan $mr="spacing-24">Preview mode enabled</OakSpan>
      <ButtonAsLink
        page={null}
        label="Exit preview"
        href={`/api/exit-preview${router.asPath}`}
        variant="minimal"
        $mr={24}
      />
      {secretParam && <CopyLinkButton href={previewURL} />}
      <BrushBorders color="white" />
    </OakFlex>
  );
};

export default LayoutPreviewControls;
