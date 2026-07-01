import Head from "next/head";
import { FC } from "react";
import { OakBox } from "@oaknational/oak-components";

import Seo, { SeoProps } from "@/browser-lib/seo/Seo";
import { usePupilStores } from "@/components/PupilComponents/Views/ViewHelpers";
import { GoogleClassroomAnalyticsProvider } from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";
import { PupilClassroomAddOnAnalytics } from "@/components/GoogleClassroom/PupilClassroomAddOnAnalytics";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { LessonShareVariant } from "@/pages-helpers/pupil";

export type PupilLayoutProps = {
  children?: React.ReactNode;
  seoProps: SeoProps;
  pupilStores?: {
    browseData: LessonBrowseData;
    lessonContent: LessonContent;
    variant: LessonShareVariant | null;
  };
};

/**
 * Layout for pupil pages. Simplified in comparison to the AppLayout as we don't include headers and footers.
 */

export const PupilLayout: FC<PupilLayoutProps> = (props) => {
  const { seoProps, children, pupilStores } = props;
  usePupilStores(pupilStores);

  return (
    <GoogleClassroomAnalyticsProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Seo {...seoProps} />
      <PupilClassroomAddOnAnalytics />
      <OakBox $height={"100vh"}>{children}</OakBox>
    </GoogleClassroomAnalyticsProvider>
  );
};
