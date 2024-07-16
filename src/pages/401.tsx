import ErrorPage from "./_error";

export default function Custom401() {
  return <ErrorPage statusCode={401} />;
}
