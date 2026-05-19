import type { GetServerSidePropsContext } from "next";

import { getServerSideProps } from "@/pages/pupils/lessons/[lessonSlug]/shared/[variant]";

describe("pages/pupils/lessons/[lessonSlug]/shared/[variant] index", () => {
  it("redirects to the overview page preserving the query string", async () => {
    const result = await getServerSideProps({
      resolvedUrl: "/pupils/lessons/lesson-1/shared/abc?utm=foo",
    } as GetServerSidePropsContext);

    expect(result).toEqual({
      redirect: {
        destination: "/pupils/lessons/lesson-1/shared/abc/overview?utm=foo",
        permanent: false,
      },
    });
  });

  it("redirects to the overview page when there is no query string", async () => {
    const result = await getServerSideProps({
      resolvedUrl: "/pupils/lessons/lesson-1/shared/abc",
    } as GetServerSidePropsContext);

    expect(result).toEqual({
      redirect: {
        destination: "/pupils/lessons/lesson-1/shared/abc/overview",
        permanent: false,
      },
    });
  });
});
