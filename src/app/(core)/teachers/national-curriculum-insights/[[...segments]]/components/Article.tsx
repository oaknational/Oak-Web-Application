"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakLI,
  OakP,
  OakPrimaryButton,
  OakSideMenuNavLink,
  OakUL,
} from "@oaknational/oak-components";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { requestNationalCurriculumInsightsDownload } from "@/common-lib/urls/nationalCurriculumInsightsDownload";

export type InsightsArticleSection = {
  id: string;
  label: string;
  content: ReactNode;
};

/** The full phase and key-stage article, using the approved 3/9 Oak grid. */
export const NationalCurriculumInsightsArticle = ({
  heading,
  sections,
  hasDownload,
}: Readonly<{
  heading: string;
  sections: InsightsArticleSection[];
  hasDownload: boolean;
}>) => {
  const mobileNav = useRef<HTMLDivElement>(null);
  const requestedSection = useRef<string | null>(null);
  const links = useMemo(
    () => sections.map(({ id, label }) => ({ id, label })),
    [sections],
  );
  const [currentId, setCurrentId] = useState(links[0]?.id);
  const selectedId = links.some(({ id }) => id === currentId)
    ? currentId
    : links[0]?.id;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (requestedSection.current) {
        setCurrentId(requestedSection.current);
        return;
      }
      const top =
        (mobileNav.current?.getBoundingClientRect().height || 16) + 32;
      const reached = links.filter(({ id }) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= top + 8;
      });
      setCurrentId(reached.at(-1)?.id ?? links[0]?.id);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const releaseRequestedSection = () => {
      requestedSection.current = null;
      schedule();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      )
        releaseRequestedSection();
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", releaseRequestedSection, {
      passive: true,
    });
    window.addEventListener("touchstart", releaseRequestedSection, {
      passive: true,
    });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", releaseRequestedSection);
      window.removeEventListener("touchstart", releaseRequestedSection);
      window.removeEventListener("keydown", onKeyDown);
      window.cancelAnimationFrame(frame);
    };
  }, [links]);

  const goToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    const title = section.querySelector<HTMLElement>("h2") ?? section;
    requestedSection.current = id;
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
    const mobileHeight = mobileNav.current?.getBoundingClientRect().height || 0;
    window.scrollTo({
      top: Math.max(
        0,
        window.scrollY +
          section.getBoundingClientRect().top -
          (mobileHeight || 16) -
          32,
      ),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    window.history.replaceState(window.history.state, "", `#${id}`);
    setCurrentId(id);
  };

  const downloadButton = (fullWidth: boolean) =>
    hasDownload ? (
      <OakPrimaryButton
        iconName="download"
        isTrailingIcon={false}
        width={fullWidth ? "100%" : "fit-content"}
        $bt="border-solid-none"
        $bb="border-solid-none"
        onClick={(event) =>
          requestNationalCurriculumInsightsDownload(event.currentTarget)
        }
      >
        Download this guidance
      </OakPrimaryButton>
    ) : null;

  return (
    <>
      <OakFlex
        ref={mobileNav}
        as="nav"
        aria-label={`${heading} sections`}
        data-insights-navigation="mobile"
        $display={["flex", "flex", "none"]}
        $position="sticky"
        $top="spacing-0"
        $zIndex="in-front"
        $background="bg-primary"
        $flexDirection="column"
        $pt="spacing-8"
        $pb="spacing-16"
        $ph="spacing-20"
        $gap="spacing-16"
        $minWidth="spacing-0"
        $width="100%"
        $boxSizing="border-box"
      >
        <OakBox $ph="spacing-4">
          <OakP $font="heading-6" $mv="spacing-0">
            {heading}
          </OakP>
        </OakBox>
        <OakFlex
          $flexDirection="column"
          $gap="spacing-20"
          $minWidth="spacing-0"
        >
          <OakUL
            $reset
            $display="flex"
            $flexDirection="row"
            $gap="spacing-4"
            $overflowX="auto"
            $width="100%"
          >
            {links.map(({ id, label }) => (
              <OakLI key={id} $flexShrink={0}>
                <OakBox
                  as="a"
                  href={`#${id}`}
                  aria-current={selectedId === id ? "location" : undefined}
                  $display="block"
                  $font="heading-light-7"
                  $color="text-primary"
                  $textDecoration="none"
                  $whiteSpace="nowrap"
                  $ph="spacing-20"
                  $pv="spacing-12"
                  $bb="border-solid-xl"
                  $borderColor={
                    selectedId === id ? "text-primary" : "bg-primary"
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    goToSection(id);
                  }}
                >
                  {label}
                </OakBox>
              </OakLI>
            ))}
          </OakUL>
          {downloadButton(true)}
        </OakFlex>
      </OakFlex>
      <OakBox
        $ph={["spacing-20", "spacing-40"]}
        $pv={["spacing-32", "spacing-40"]}
      >
        <OakGrid
          data-insights-module="article"
          $maxWidth="spacing-1280"
          $width="100%"
          $mh="auto"
          $cg="spacing-16"
          $rg="spacing-32"
        >
          <OakGridArea $colSpan={3} $display={["none", "none", "block"]}>
            <OakFlex
              as="nav"
              aria-label={`${heading} sections`}
              data-insights-navigation="desktop"
              $position="sticky"
              $top="spacing-24"
              $flexDirection="column"
              $alignItems="flex-start"
              $gap="spacing-32"
              onClick={(event) => {
                if (
                  event.target instanceof Element &&
                  event.target.closest("a")
                )
                  event.preventDefault();
              }}
            >
              <OakBox $ph="spacing-4">
                <OakP $font="heading-6" $mv="spacing-0">
                  {heading}
                </OakP>
              </OakBox>
              <OakFlex $flexDirection="column" $gap="spacing-24">
                <OakUL
                  $reset
                  $display="flex"
                  $flexDirection="column"
                  $gap="spacing-4"
                >
                  {links.map(({ id, label }) => (
                    <OakLI key={id}>
                      <OakSideMenuNavLink
                        item={{ heading: label, href: `#${id}` }}
                        isSelected={selectedId === id}
                        selectedHeadingFont="heading-light-7"
                        $ph="spacing-16"
                        $pv="spacing-12"
                        onClick={() => goToSection(id)}
                      />
                    </OakLI>
                  ))}
                </OakUL>
                {downloadButton(false)}
              </OakFlex>
            </OakFlex>
          </OakGridArea>
          <OakGridArea $colSpan={[12, 12, 9]} $minWidth="spacing-0">
            <OakFlex
              $flexDirection="column"
              $gap={["spacing-32", "spacing-40", "spacing-80"]}
            >
              {sections.map(({ id, content }) => (
                <OakBox
                  key={id}
                  id={id}
                  data-insights-article-section={id}
                  $scrollMarginTop={[
                    "spacing-240",
                    "spacing-240",
                    "spacing-48",
                  ]}
                >
                  {content}
                </OakBox>
              ))}
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </OakBox>
    </>
  );
};
