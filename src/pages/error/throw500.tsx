export async function getServerSideProps() {
  throw new Error("don't catch me for a 500 response");
  return { props: {} };
}

export default function Index() {
  return <h1>You should not see me</h1>;
}
