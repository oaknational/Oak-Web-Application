import { NextPage } from "next";

import Bookmarks from "../../components/Bookmarks";
import AppLayout, { AppLayoutProps } from "../../components/AppLayout";

type BookmarksPageProps = {
  __testAppLayoutProps?: Partial<AppLayoutProps>;
};
const BookmarksPage: NextPage<BookmarksPageProps> = (props) => {
  const { __testAppLayoutProps } = props;
  return (
    <AppLayout
      seoProps={{
        title: "Lesson bookmarks page : Oak National Academy",
        description:
          "Bookmarks - giving you quick and easy access to Oak National Academy lessons and resources",
      }}
      {...__testAppLayoutProps}
    >
      <Bookmarks />
    </AppLayout>
  );
};

export default BookmarksPage;
