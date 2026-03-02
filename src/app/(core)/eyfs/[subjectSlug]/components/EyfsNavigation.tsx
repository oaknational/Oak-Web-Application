"use client";

import { useParams } from "next/navigation";
import { parseSpacing, parseColor } from "@oaknational/oak-components";
import Link from "next/link";
import styled from "styled-components";

import {
  OakFlex,
  OakPrimaryButton,
  OakSecondaryButton,
} from "@/styles/oakThemeApp";

type SubjectTab = {
  slug: string;
  title: string;
};

type EYFSNavigationProps = {
  subjectTabs: SubjectTab[];
};

/**
 * Negative `margin-inline` leaves room for the scroll indicators to be hidden
 * when the scroller is at the start or end of the scroll area.
 * it also gives us a bit more room for scrolling on mobile.
 *
 * Negative`margin-bottom` is used to offset the padding of the scroller.
 */
const Scroller = styled(OakFlex)`
  position: relative;

  margin-inline: -${parseSpacing("spacing-20")};
  margin-block: -${parseSpacing("spacing-8")};
`;

const ScrollIndicators = styled(OakFlex)`
  position: relative;

  &::before {
    content: "";
    position: sticky;
    top: 0;
    left: 0;
    height: 100%;
    min-width: ${parseSpacing("spacing-20")};
    background: linear-gradient(
      to left,
      transparent,
      ${parseColor("bg-primary")}
    );
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: "";
    position: sticky;
    top: 0;
    right: 0;
    height: 100%;
    min-width: ${parseSpacing("spacing-20")};
    background: linear-gradient(
      to right,
      transparent,
      ${parseColor("bg-primary")}
    );
    pointer-events: none;
    z-index: 1;
  }
`;

export const EYFSNavigation = ({
  subjectTabs,
}: Readonly<EYFSNavigationProps>) => {
  const params = useParams();
  return (
    <Scroller as="nav" $whiteSpace="nowrap" $overflowX="auto" $pv="spacing-8">
      <ScrollIndicators>
        <OakFlex $gap="spacing-8">
          {subjectTabs.map((subject) => {
            const Button =
              params?.subjectSlug === subject.slug
                ? OakPrimaryButton
                : OakSecondaryButton;

            return (
              <Button
                key={subject.slug}
                element={Link}
                href={`/eyfs/${subject.slug}`}
              >
                {pickSubjectTitle(subject)}
              </Button>
            );
          })}
        </OakFlex>
      </ScrollIndicators>
    </Scroller>
  );
};

export function pickSubjectTitle(subject: SubjectTab) {
  if (subject.slug === "personal-social-and-emotional-development") {
    return "PSED";
  }
  return subject.title;
}
