import ErrorPage from "./_error";

export default function Custom500() {
  return <ErrorPage statusCode={500} />;
}
