import { FC } from "react";
import styled from "styled-components";
import { OakP, OakHeading, OakMaxWidth } from "@oaknational/oak-components";

import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import {
  HeaderVariant,
  FooterVariant,
} from "@/components/AppComponents/Layout/Layout";
import Layout from "@/components/AppComponents/Layout";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import ButtonGroup from "@/components/SharedComponents/ButtonGroup";
import Button from "@/components/SharedComponents/Button";
import Flex from "@/components/SharedComponents/Flex.deprecated";

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
  headerVariant?: HeaderVariant;
  footerVariant?: FooterVariant;
};
const ErrorView: FC<ErrorViewProps> = (props) => {
  const { onBackClick, statusCode, headerVariant, footerVariant } = props;
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      headerVariant={headerVariant}
      footerVariant={footerVariant}
    >
      <OakMaxWidth $alignItems={"flex-end"}>
        <Flex
          $mv={80}
          $flexDirection={"column"}
          $width={["100%", "50%"]}
          $ph={16}
        >
          <Flex
            data-testid="errorStatus"
            $justifyContent={["flex-end", "flex-start"]}
          >
            {statusCode ? (
              <ErrorHeading tag="h1">{statusCode}</ErrorHeading>
            ) : (
              <OakHeading $font={"heading-5"} $mb="space-between-xs" tag="h1">
                An error occurred
              </OakHeading>
            )}
          </Flex>

          <OakHeading
            $mb="space-between-l"
            $font={["heading-5", "heading-4"]}
            tag={"h2"}
          >
            Whoops! It looks like you have fallen too far from the tree.
          </OakHeading>

          <OakP $mb="space-between-m">Let's get you back to browsing</OakP>
          <ButtonGroup>
            {onBackClick && (
              <Button
                onClick={onBackClick}
                variant="minimal"
                icon="arrow-left"
                $iconPosition="trailing"
                iconBackground={"blue"}
                size="large"
                label={"Go back"}
              />
            )}
            <ButtonAsLink
              data-testid="homeButton"
              variant="minimal"
              icon="home"
              $iconPosition="trailing"
              iconBackground={"blue"}
              size="large"
              label={"Home"}
              page={"home"}
            />
          </ButtonGroup>
        </Flex>
      </OakMaxWidth>
    </Layout>
  );
};

export default ErrorView;
