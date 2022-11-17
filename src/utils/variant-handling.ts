import { GetStaticProps, GetStaticPropsContext } from "next";

const getVariantsForPath = async (): Promise<string[]> => {
  // Do some kind of lookup here
  return ["hubspotForms"];
};

// Note: only works with one variant at a time, should be product of
// all variants
const variantsToPaths = (variants: string[]) => {
  return variants.flatMap((variantName) => [
    { params: { variant: `variant--${variantName}:true` } },
    { params: { variant: `variant--${variantName}:false` } },
  ]);
};

export const getVariantPaths = async () => {
  const variants = await getVariantsForPath();
  return variantsToPaths(variants);
};

const parseVariantFromPath = (path: string) => {
  // Do some regex'ing here, not this dumb if-else
  if (path === "variant--hubspotForms:true") {
    return { hubspotForms: true };
  } else if (path === "variant--hubspotForms:false") {
    return { hubspotForms: false };
  }

  return {};
};

export const decorateWithVariants = async <G extends GetStaticProps>(
  context: GetStaticPropsContext,
  originalGetStaticProps: G
) => {
  const variants =
    typeof context?.params?.variant === "string"
      ? parseVariantFromPath(context.params.variant)
      : {};

  // @TODO: Strip variants prop from here, original is receiving
  // the context.params.variants, which may be confusing / lead to confusion
  const gspReturnVal = await originalGetStaticProps(context);

  if ("props" in gspReturnVal) {
    return { ...gspReturnVal, props: { ...gspReturnVal.props, variants } };
  } else {
    return gspReturnVal;
  }
};
