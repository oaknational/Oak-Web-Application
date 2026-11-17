import { useUser } from "@clerk/nextjs";

import { useTeacherBrowseAnalytics } from "../../../context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import PromoBannerWithVideo from "../PromoBannerWithVideo";

const composeAilaLink = ({
  keyStage,
  subject,
  unitTitle,
  searchExpression,
}: {
  keyStage?: string;
  subject?: string;
  unitTitle?: string;
  searchExpression?: string;
}) => {
  const baseUrl = `https://labs.thenational.academy/aila`;
  const keyStageParam = keyStage ? `keyStage=${keyStage}&` : "";
  const subjectParam = subject ? `subject=${subject}&` : "";
  const unitTitleParam = unitTitle ? `unitTitle=${unitTitle}&` : "";
  const searchExpressionParam = searchExpression
    ? `searchExpression=${searchExpression}`
    : "";
  return `${baseUrl}?${keyStageParam}${subjectParam}${unitTitleParam}${searchExpressionParam}`;
};

const SignPostToAila = ({
  title,
  text,
  subject,
  keyStage,
  unitTitle,
  searchExpression,
}: {
  title: string;
  text: string;
  keyStage?: string;
  unitTitle?: string;
  subject?: string;
  searchExpression?: string;
}) => {
  const videoPlaybackID = "XjKNXfXcZqEIb3sRmgqqw901S3AoN8mllBS5yUnKSvb4";
  const { lessonAssistantAccessed } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );
  const { isSignedIn, isLoaded } = useUser();
  return (
    <PromoBannerWithVideo
      title={title}
      text={text}
      buttonText="Create a lesson with AI"
      buttonIconName="external"
      href={composeAilaLink({ keyStage, subject, unitTitle, searchExpression })}
      videoPlaybackID={videoPlaybackID}
      onClick={() => {
        lessonAssistantAccessed({ isLoggedIn: isLoaded && isSignedIn });
      }}
    />
  );
};

export default SignPostToAila;
