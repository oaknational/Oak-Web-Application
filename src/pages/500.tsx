import Button from "../components/Button";
import Layout from "../components/Layout";

export default function Custom500() {
  return (
    <Layout>
      <h1>500 - Server-side error occurred</h1>
      <h3>Get back on track</h3>
      <Button href="/" label={"Home page"}>
        Homepage
      </Button>
    </Layout>
  );
}
