import { GetStaticPaths, GetStaticPropsContext } from "next";

import ContactUs, { getStaticProps as mainGetStaticProps } from "../contact-us";
import {
  getVariantPaths,
  decorateWithVariants,
} from "../../utils/variant-handling";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getVariantPaths();
  return { paths, fallback: false };
};

// @TODO: add types
export const getStaticProps = async (context: GetStaticPropsContext) => {
  return decorateWithVariants(context, mainGetStaticProps);
};

export default ContactUs;
