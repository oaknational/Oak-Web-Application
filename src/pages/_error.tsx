import { NextPage, NextPageContext } from "next";
import styled from "styled-components";

import Layout from "../components/Layout";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import Flex from "../components/Flex";
import { Heading, P } from "../components/Typography";
import ButtonGroup from "../components/ButtonGroup/ButtonGroup";
import ButtonAsLink from "../components/Button/ButtonAsLink";

interface Props {
  statusCode?: number;
}

const shadow =
  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";

const ErrorHeading = styled.h1`
  color: white;
  font-size: 120px;
  text-shadow: ${shadow};
`;

const ErrorPage: NextPage<Props> = ({ statusCode }) => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      <MaxWidth $alignItems={"flex-end"}>
        <Flex
          $mv={80}
          $flexDirection={"column"}
          $width={["100%", "50%"]}
          $ph={16}
        >
          <Flex $justifyContent={["flex-end", "flex-start"]}>
            <ErrorHeading data-testid="errorStatus">
              {statusCode ? statusCode : "An error occurred on client"}
            </ErrorHeading>
          </Flex>

          <Heading $mb={48} $fontSize={[24, 32]} tag={"h2"}>
            Whoops! It looks like you have fallen too far from the tree.
          </Heading>

          <P $mb={24}>Lets get you back to browsing</P>
          <ButtonGroup>
            <ButtonAsLink
              variant="minimal"
              icon="ChevronRight"
              label={"Go back"}
              href={"/"}
            />
            <ButtonAsLink
              data-testid="homeButton"
              variant="minimal"
              icon="Home"
              label={"Home"}
              href={"/"}
            />
          </ButtonGroup>
        </Flex>
      </MaxWidth>
    </Layout>
  );
};

export const getInitialProps = ({ res, err }: NextPageContext) => {
  let statusCode;
  if (res) {
    statusCode = res.statusCode;
  } else {
    statusCode = err ? err.statusCode : 404;
  }

  return { statusCode };
};

export default ErrorPage;
