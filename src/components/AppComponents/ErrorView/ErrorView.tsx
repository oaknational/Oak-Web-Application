import Link from "next/link";
import { FC } from "react";
import styled from "styled-components";
import {
  OakP,
  OakHeading,
  OakMaxWidth,
  OakFlex,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { TopNavProps } from "../TopNav/TopNav";

import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/AppComponents/AppLayout";
import ButtonGroup from "@/components/SharedComponents/ButtonGroup";
import { resolveOakHref } from "@/common-lib/urls";

const shadow =
  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";

const ErrorHeading = styled(OakHeading)`
  color: white;
  font-size: 120px;
  line-height: 144px;
  text-shadow: ${shadow};
`;

type ErrorViewProps = {
  onBackClick?: () => void;
  statusCode?: number;
  topNav: TopNavProps;
};
const ErrorView: FC<ErrorViewProps> = (props) => {
  const { onBackClick, statusCode, topNav } = props;
  return (
    <AppLayout
      seoProps={DEFAULT_SEO_PROPS}
      appVariant={"client-error"}
      topNavProps={topNav}
    >
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
              <OakTertiaryButton onClick={onBackClick} iconName="arrow-left">
                Go back
              </OakTertiaryButton>
            )}
            <OakTertiaryButton
              element={Link}
              iconName="home"
              href={resolveOakHref({ page: "home" })}
            >
              Home
            </OakTertiaryButton>
          </ButtonGroup>
        </OakFlex>
      </OakMaxWidth>
    </AppLayout>
  );
};

export default ErrorView;
