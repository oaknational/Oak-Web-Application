import {
  OakBox,
  OakLI,
  OakSideMenuNavLink,
  OakUL,
} from "@oaknational/oak-components";
import { RefObject, useMemo } from "react";

import { useCurrentSection } from "@/hooks/useCurrentSection";

export default function MeetTheTeamNav({
  sectionRefs,
}: Readonly<{
  sectionRefs: Record<
    "our-leadership" | "our-board" | "documents",
    RefObject<HTMLElement>
  >;
}>) {
  const { currentSectionId: currentSectionIdOrig } = useCurrentSection({
    sectionRefs,
  });
  const currentSectionId = currentSectionIdOrig ?? "our-leadership";

  const menuLinks = useMemo(
    () => [
      {
        heading: "Our leadership",
        href: "#our-leadership",
      },
      {
        heading: "Our board",
        href: "#our-board",
      },
      {
        heading: "Documents",
        href: "#documents",
      },
    ],
    [],
  );

  return (
    <OakBox
      as="nav"
      aria-label="page sections"
      $minWidth={"spacing-180"}
      $display={["none", "block", "block"]}
      $position={"sticky"}
      $top="spacing-20"
      $pb={"spacing-80"}
    >
      <OakUL $reset $display="flex" $gap="spacing-16" $flexDirection="column">
        {menuLinks.map((link) => {
          const anchorId = link.href.replace(/^#/, "");
          const isCurrent = anchorId === currentSectionId;

          return (
            <OakLI key={`${link.href}`}>
              <OakSideMenuNavLink
                onClick={() => {
                  document.getElementById(anchorId)?.scrollIntoView();
                }}
                item={link}
                isSelected={isCurrent}
                $pt={"spacing-8"}
                $pb={"spacing-8"}
              />
            </OakLI>
          );
        })}
      </OakUL>
    </OakBox>
  );
}
