"use client";
import { useState, useCallback } from "react";
import {
  OakSecondaryButton,
  OakInformativeModal,
  OakBox,
  OakUL,
  OakLI,
  OakFlex,
  OakHeading,
  OakSvg,
  OakPupilJourneyYearButton,
  OakLeftAlignedButton,
} from "@oaknational/oak-components";
import Link from "next/link";

import { PupilsSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { resolveOakHref } from "@/common-lib/urls";

export function PupilsTopNavHamburger(props: Readonly<PupilsSubNavData>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <OakBox $display={["block", "block", "none"]}>
      <OakSecondaryButton
        iconGap={"spacing-8"}
        data-testid="pupils-top-nav-hamburger-button"
        $borderStyle={"none"}
        isTrailingIcon
        iconName="hamburger"
        onClick={() => handleOpen()}
      >
        Menu
      </OakSecondaryButton>
      <OakInformativeModal
        isOpen={isOpen}
        onClose={() => handleClose()}
        closeOnBackgroundClick
        largeScreenMaxWidth={480}
      >
        <MainMenuContent {...props} onClick={handleClose} />
      </OakInformativeModal>
    </OakBox>
  );
}

function MainMenuContent(
  props: Readonly<PupilsSubNavData> & {
    onClick: () => void;
  },
) {
  return (
    <OakUL
      $display={"flex"}
      $flexDirection={"column"}
      $pa={"spacing-40"}
      $gap={"spacing-40"}
    >
      <YearSection {...props.primary} onClick={props.onClick} />
      <YearSection {...props.secondary} onClick={props.onClick} />
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <OakLeftAlignedButton
          width={"100%"}
          element={Link}
          rightAlignIcon
          target="_blank"
          iconName="external"
          onClick={props.onClick}
          href={resolveOakHref({ page: "help" })}
        >
          Help using Oak
        </OakLeftAlignedButton>
      </OakFlex>
    </OakUL>
  );
}

function YearSection(
  props: Readonly<{
    title: "Primary" | "Secondary";
    slug: "primary" | "secondary";
    children: Array<{ title: string; slug: string }>;
    onClick: () => void;
  }>,
) {
  return (
    <OakFlex $flexDirection={"column"} $width={"100%"} $gap={"spacing-40"}>
      <OakFlex
        $flexDirection={"column"}
        $width={"fit-content"}
        $mb={"spacing-12"}
      >
        <OakBox $position={"relative"}>
          <OakHeading tag="h2" $font={"heading-6"}>
            {props.title}
          </OakHeading>
          <OakSvg
            $position={"absolute"}
            $color={"bg-decorative1-main"}
            $display={"block"}
            name={"underline"}
            $height={"spacing-8"}
          />
        </OakBox>
      </OakFlex>
      <OakFlex
        $flexDirection={"row"}
        $flexWrap={"wrap"}
        $gap={"spacing-16"}
        $width={"100%"}
      >
        {props.children.map((year) => (
          <OakLI key={year.slug} $listStyle={"none"}>
            <OakPupilJourneyYearButton
              phase={props.slug}
              element={Link}
              onClick={props.onClick}
              href={resolveOakHref({
                page: "pupil-subject-index",
                yearSlug: year.slug,
              })}
            >
              {year.title}
            </OakPupilJourneyYearButton>
          </OakLI>
        ))}
      </OakFlex>
    </OakFlex>
  );
}
