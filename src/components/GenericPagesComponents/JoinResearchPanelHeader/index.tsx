import { OakBox, OakBreadcrumbs } from "@oaknational/oak-components";

import { AboutCalloutWithCta } from "../AboutCalloutWithCta";
import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import { resolveOakHref } from "@/common-lib/urls/urls";

export default function JoinResearchPanelPageHeader({
  title,
  bodyRaw,
  image,
  button,
}: JoinResearchPanelPageBlock<"JoinResearchPanelPageHeader">) {
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
      <AboutCalloutWithCta
        headingTag="h1"
        title={title}
        text={bodyRaw}
        image={image}
        link={{
          text: button.label,
          href: getLinkHref(button),
        }}
        $pv={"spacing-32"}
        $pb={["spacing-56", "spacing-72", "spacing-72"]}
        hideImageOnMobile={true}
      />
    </>
  );
}
