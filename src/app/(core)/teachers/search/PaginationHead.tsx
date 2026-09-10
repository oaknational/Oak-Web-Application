import Head from "next/head";
import { resolveHref } from "next/dist/client/resolve-href";
import { useRouter } from "next/router";
import { Url } from "next/dist/shared/lib/router/router";

type PaginationHeadProps = {
  isFirstPage: boolean;
  isLastPage: boolean;
  prevPageUrlObject: Url | undefined;
  nextPageUrlObject: Url | undefined;
};

const PaginationHead: React.FC<PaginationHeadProps> = ({
  isFirstPage,
  isLastPage,
  prevPageUrlObject,
  nextPageUrlObject,
}) => {
  const router = useRouter();

  return (
    <Head>
      {!isFirstPage && (
        <link
          rel="prev"
          href={resolveHref(router, prevPageUrlObject || "", true)[1]}
        />
      )}
      {!isLastPage && (
        <link
          rel="next"
          href={resolveHref(router, nextPageUrlObject || "", true)[1]}
        />
      )}
    </Head>
  );
};

export default PaginationHead;
