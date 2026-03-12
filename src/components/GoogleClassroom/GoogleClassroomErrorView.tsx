"use client";
import styled from "styled-components";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakMaxWidth,
  OakP,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";

const shadow =
  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";

const ErrorHeading = styled(OakHeading)`
  color: white;
  font-size: 120px;
  line-height: 144px;
  text-shadow: ${shadow};
`;

type Props = {
  readonly statusCode?: number;
};

export default function GoogleClassroomErrorView({ statusCode }: Props) {
  const router = useRouter();
  return (
    <OakMaxWidth $alignItems={"center"}>
      <OakFlex
        $flexDirection="column"
        $mv="spacing-80"
        $ph={["spacing-16"]}
        $width={["100%", "50%"]}
      >
        <OakBox data-testid="errorStatus">
          {statusCode ? (
            <ErrorHeading tag="h1">{statusCode}</ErrorHeading>
          ) : (
            <OakHeading $font="heading-5" $mb="spacing-12" tag="h1">
              An error occurred
            </OakHeading>
          )}
        </OakBox>
        <OakHeading
          $mb="spacing-48"
          $font={["heading-5", "heading-4"]}
          tag="h2"
        >
          Whoops! It looks like you have fallen too far from the tree.
        </OakHeading>
        <OakP $mb="spacing-24">Let's get you back to browsing</OakP>
        <OakTertiaryButton onClick={() => router.back()} iconName="arrow-left">
          Go back
        </OakTertiaryButton>
      </OakFlex>
    </OakMaxWidth>
  );
}
