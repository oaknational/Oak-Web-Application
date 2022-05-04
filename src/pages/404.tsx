import Layout from "../components/Layout";
import Button from "../components/Button";

export default function Custom404() {
  return (
    <Layout>
      <h2 data-testid="404Heading">404 - Page Not Found</h2>
      <h3>Get back on track</h3>
      <Button href="/" label={"Homepage"}>
        Homepage
      </Button>
    </Layout>
  );
}
