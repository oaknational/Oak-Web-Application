import { GetServerSideProps, NextPage } from "next";

const SharedLessonVariantIndexPage: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({
  resolvedUrl,
}) => {
  const queryIndex = resolvedUrl.indexOf("?");
  const hasQuery = queryIndex !== -1;
  const pathname = !hasQuery ? resolvedUrl : resolvedUrl.slice(0, queryIndex);
  const queryParams = !hasQuery ? "" : resolvedUrl.slice(queryIndex);
  const destination = `${pathname}/overview${queryParams}`;

  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
};

export default SharedLessonVariantIndexPage;
