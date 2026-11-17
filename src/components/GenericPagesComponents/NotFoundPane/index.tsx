"use client";
import Link from "next/link";
import {
  OakMaxWidth,
  OakFlex,
  OakHeading,
  OakP,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import styled from "styled-components";

import ButtonGroup from "@/components/SharedComponents/ButtonGroup";
import { resolveOakHref } from "@/common-lib/urls/urls";

const shadow =
  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";

const ErrorHeading = styled(OakHeading)`
  color: white;
  font-size: 120px;
  line-height: 144px;
  text-shadow: ${shadow};
`;

type NotFoundPaneProps = {
  onBackClick?: () => void;
  statusCode?: number;
};

export default function NotFoundPane({
  statusCode,
  onBackClick,
}: Readonly<NotFoundPaneProps>) {
  return (
    <OakMaxWidth $alignItems={"flex-end"}>
      <OakFlex
        $mv={"spacing-80"}
        $flexDirection={"column"}
        $width={["100%", "50%"]}
        $ph={"spacing-16"}
      >
        <OakFlex
          data-testid="errorStatus"
          $justifyContent={["flex-end", "flex-start"]}
        >
          {statusCode ? (
            <ErrorHeading tag="h1">{statusCode}</ErrorHeading>
          ) : (
            <OakHeading $font={"heading-5"} $mb="spacing-12" tag="h1">
              An error occurred
            </OakHeading>
          )}
        </OakFlex>

        <OakHeading
          $mb="spacing-48"
          $font={["heading-5", "heading-4"]}
          tag={"h2"}
        >
          Whoops! It looks like you have fallen too far from the tree.
        </OakHeading>

        <OakP $mb="spacing-24">Let's get you back to browsing</OakP>
        <ButtonGroup>
          {onBackClick && (
            <OakTertiaryButton
              isTrailingIcon
              onClick={onBackClick}
              iconName="arrow-left"
            >
              Go back
            </OakTertiaryButton>
          )}
          <OakTertiaryButton
            data-testid="homeButton"
            element={Link}
            iconName="home"
            isTrailingIcon
            href={resolveOakHref({ page: "home" })}
          >
            Home
          </OakTertiaryButton>
        </ButtonGroup>
      </OakFlex>
    </OakMaxWidth>
  );
}
