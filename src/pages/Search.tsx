import { GetServerSideProps, NextPage } from "next";

import Layout from "../components/Layout";

const SearchPage: NextPage = () => {
  return <Layout></Layout>;
};

const constructQuery = (queryTerms = "") => {
  return {
    query: {
      bool: {
        must: [
          {
            multi_match: {
              query: queryTerms,
            },
          },
        ],
      },
    },
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  let { text } = query;
  text = Array.isArray(text) ? text[0] : text;

  const elasticQuery = constructQuery(text);

  const btoa = (str: string) => Buffer.from(str).toString("base64");

  const requestOptions = {
    method: "POST",
    headers: new Headers({
      Authorization: `Basic ${btoa(
        `${process.env.ELASTIC_USER}:${process.env.ELASTIC_PASS}`
      )}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(elasticQuery),
  };

  const response = await fetch(
    `https://${process.env.ELASTIC_USER}:${process.env.ELASTIC_PASS}@${process.env.ELASTIC_DOMAIN}.europe-west2.gcp.elastic-cloud.com:9243/units_production,subjects_production,lessons_production/_search`,
    requestOptions
  );

  const json = await response.json();

  console.log(json);

  const props = {};

  return { props };
};

export default SearchPage;
