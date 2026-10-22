import { OakBox, OakBreadcrumbs } from "@oaknational/oak-components";

import { AboutUsCalloutWithCta } from "../AboutUsCalloutWithCta";
import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import { resolveOakHref } from "@/common-lib/urls/urls";

export type JoinResearchPanelHeaderProps = Omit<
  JoinResearchPanelPageBlock<"JoinResearchPanelPageHeader">,
  "__typename"
>;

export default function JoinResearchPanelPageHeader({
  title,
  bodyRaw,
  image,
  button,
}: Readonly<JoinResearchPanelHeaderProps>) {
  return (
    <>
      <NewGutterMaxWidth>
        <OakBox $pt={["spacing-24", "spacing-32", "spacing-32"]}>
          <OakBreadcrumbs
            breadcrumbs={[
              {
                href: resolveOakHref({ page: "home" }),
                text: "Home",
              },
              {
                href: resolveOakHref({ page: "about-get-involved" }),
                text: "Get involved",
              },
              {
                text: "Join the Oak research panel",
              },
            ]}
          />
        </OakBox>
      </NewGutterMaxWidth>
      <OakBox
        $pt={"spacing-32"}
        $pb={["spacing-56", "spacing-72", "spacing-72"]}
      >
        <AboutUsCalloutWithCta
          headingTag="h1"
          title={title}
          text={bodyRaw}
          image={image}
          link={{
            text: button.label,
            href: getLinkHref(button),
          }}
          $imageDisplay={["none", "flex", "flex"]}
        />
      </OakBox>
    </>
  );
}
