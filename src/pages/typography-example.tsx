import { FC } from "react";

import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Layout from "../components/Layout";
import Text from "../components/Typography/Typography";

const Typography: FC = () => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      <Text semanticVariant="h2">h2 - Heading</Text>
      <Text semanticVariant="h3">h3 - Heading</Text>
      <Text semanticVariant="h4">h4 - Heading</Text>
      <Text semanticVariant="body1">body 1</Text>
      <Text semanticVariant="body2">body 2</Text>
      <Text semanticVariant="body3">body 3</Text>
    </Layout>
  );
};

export default Typography;
