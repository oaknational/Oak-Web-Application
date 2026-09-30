import {
  OakBox,
  OakLI,
  OakLink,
  OakP,
  OakSideMenuNavLink,
  OakUL,
} from "@oaknational/oak-components";
import { RefObject } from "react";

import { useCurrentSection } from "@/hooks/useCurrentSection";

export function CaseStudyNav({
  links,
  sectionRefs,
}: {
  links: { label: string; anchor: string }[];
  sectionRefs: Record<string, RefObject<HTMLDivElement>>;
}) {
  const { currentSectionId } = useCurrentSection({ sectionRefs });

  return (
    <OakBox
      as="nav"
      aria-label="page sections"
      $position={["static", "sticky", "sticky"]}
      $top="spacing-20"
      $pb={["spacing-56", "spacing-0", "spacing-0"]}
    >
      <OakP
        $font={["body-2-bold", "body-2", "body-2"]}
        $color={["text-primary", "text-subdued", "text-subdued"]}
        $mb="spacing-16"
      >
        Contents
      </OakP>
      <OakUL $reset $display="flex" $gap="spacing-16" $flexDirection="column">
        {links.map(({ label, anchor }) => (
          <OakLI key={anchor}>
            <OakBox $display={["block", "none", "none"]} $pv="spacing-4">
              <OakLink
                href={`#${anchor}`}
                onClick={() =>
                  document.getElementById(anchor)?.scrollIntoView()
                }
              >
                {label}
              </OakLink>
            </OakBox>
            <OakBox $display={["none", "block", "block"]}>
              <OakSideMenuNavLink
                onClick={() =>
                  document.getElementById(anchor)?.scrollIntoView()
                }
                item={{ heading: label, href: `#${anchor}` }}
                isSelected={anchor === (currentSectionId ?? links[0]?.anchor)}
                $pt={"spacing-8"}
                $pb={"spacing-8"}
              />
            </OakBox>
          </OakLI>
        ))}
      </OakUL>
    </OakBox>
  );
}
