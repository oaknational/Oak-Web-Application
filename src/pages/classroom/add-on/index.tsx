import { useRouter } from "next/router";
import {
  OakBox,
  OakCheckBox,
  oakDefaultTheme,
  OakHeading,
  OakP,
  OakThemeProvider,
} from "@oaknational/oak-components";
import React, { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonListingPageData } from "@/node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import { ClassroomBrowserView } from "@/components/ClassroomAddonComponents/ClassroomBrowserView";
import { LessonListItemProps } from "@/components/TeacherComponents/LessonListItem";

type Props = {
  curriculumData: LessonListingPageData;
  children: React.ReactNode;
};
const GoogleClassroomAddOnHomepage: NextPage<Props> = ({ curriculumData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [demoWithGradebook, setDemoWithGradebook] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState();
  const router = useRouter();
  const { courseId, itemId, itemType, addOnToken, login_hint } = router.query;

  const signInBtnClick = async () => {
    try {
      const response = await fetch("/api/classroom/auth", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.authUrl);
        window.open(
          data.authUrl,
          "popUpWindow",
          "height=500,width=500,left=100,top=100,resizable=no," +
            "scrollbars=yes,toolbar=yes,menubar=no,location=yes," +
            "directories=no,status=yes",
        );
      } else {
        console.log("error", response.status, response.json());
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/classroom/auth/session", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // todo: once there is a store we can set the auth token in session storage
        console.log(data);
      } else {
        console.log("error", response.status, response.json());
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthComplete = (event: MessageEvent) => {
    console.log("handleAuthComplete", event);
    if (
      event.data.type === "auth_complete" &&
      event.data.success &&
      event.data.authToken
    ) {
      /*
       * This is temporary, we should call checkAuthStatus, but that is not
       * returning an auth token yet because we have not set up a store for the tokens
       * ordinarily we would not return the authToken in the postMessage
       */
      //
      sessionStorage.setItem(
        "oak-classroom-add-on-auth-token",
        event.data.authToken,
      );
      setAuthToken(event.data.authToken);
    }
  };

  const onLessonSelected = async (item: LessonListItemProps) => {
    console.log("onLessonSelected", item);
    try {
      // this is a temp solution to get pupil uri for the spike
      const getPupilProgrammeSlug = () => {
        const splitSlug = item.programmeSlug.split("-");
        const removeKsSlug = splitSlug.filter((s) => s !== item.keyStageSlug);
        const withYearSlug = [...removeKsSlug, item.yearSlug];
        return withYearSlug.join("-");
      };
      const gradebookExtraProps = demoWithGradebook
        ? {
            studentWorkReviewUri: `/teachers/programmes/${item.programmeSlug}/units/${item.unitSlug}/lessons/${item.lessonSlug}`,
            maxPoints: 10,
          }
        : {};
      const response = await fetch("/api/classroom/attachment/create", {
        credentials: "include",
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          itemId,
          courseId,
          addOnToken,
          loginHint: login_hint, // will use this in non-spike to handle any needed refreshes
          title: item.lessonTitle,
          teacherViewUri: `/teachers/programmes/${item.programmeSlug}/units/${item.unitSlug}/lessons/${item.lessonSlug}`,
          studentViewUri: `/pupils/programmes/${getPupilProgrammeSlug()}/units/${item.unitSlug}/lessons/${item.lessonSlug}`,
          ...gradebookExtraProps,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("onLessonSelectedOk", data);
      } else {
        console.log("error", response.status, await response.json());
      }
    } catch (error) {
      console.log("onLessonSelectedError", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener("message", handleAuthComplete);
    return () => {
      window.removeEventListener("message", handleAuthComplete);
    };
  }, []);

  if (isLoading) return <>Loading...</>;

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakHeading tag={"h1"}>Google Classroom Dev</OakHeading>
      <OakP>courseId={courseId}</OakP>
      <OakP>itemId={itemId}</OakP>
      <OakP>itemType={itemType}</OakP>
      <OakP>addOnToken={addOnToken}</OakP>
      <OakP $mb={"space-between-s"}>login_hint={login_hint}</OakP>
      <OakCheckBox
        id={"demo-gradebook"}
        value={"demo-gradebook"}
        displayValue={"Demo with gradebook"}
        checked={demoWithGradebook}
        onChange={() => setDemoWithGradebook(!demoWithGradebook)}
      />
      <OakBox $mt={"space-between-s"}>
        {authToken ? (
          <OakP>Signed in. Auth token is {authToken}</OakP>
        ) : (
          <button onClick={signInBtnClick}>Sign in with Google</button>
        )}
      </OakBox>
      <ClassroomBrowserView
        curriculumData={curriculumData}
        onLessonSelected={onLessonSelected}
      />
    </OakThemeProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // outside of spike we wouldnt want to do this here, because its going to load it when the user may not be signed in
  const curriculumData: LessonListingPageData =
    await curriculumApi2023.lessonListing({
      programmeSlug: "computing-primary-ks2",
      unitSlug: "computer-networks",
    });
  return {
    props: {
      curriculumData,
    },
  };
};

export default GoogleClassroomAddOnHomepage;
