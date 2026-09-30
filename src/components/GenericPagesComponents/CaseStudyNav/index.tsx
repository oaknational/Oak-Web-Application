import {
  OakBox,
  OakLI,
  OakP,
  OakSideMenuNavLink,
  OakUL,
} from "@oaknational/oak-components";
import { RefObject } from "react";

import { useCurrentSection } from "@/hooks/useCurrentSection";

export default function CaseStudyNav({
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
      $display={["none", "block", "block"]}
      $position="sticky"
      $top="spacing-20"
    >
      <OakP $font="body-3" $mb="spacing-8">
        Contents
      </OakP>
      <OakUL $reset $display="flex" $gap="spacing-16" $flexDirection="column">
        {links.map(({ label, anchor }) => (
          <OakLI key={anchor}>
            <OakSideMenuNavLink
              onClick={() => document.getElementById(anchor)?.scrollIntoView()}
              item={{ heading: label, href: `#${anchor}` }}
              isSelected={anchor === (currentSectionId ?? links[0]?.anchor)}
              $pt={"spacing-8"}
              $pb={"spacing-8"}
            />
          </OakLI>
        ))}
      </OakUL>
    </OakBox>
  );
}
