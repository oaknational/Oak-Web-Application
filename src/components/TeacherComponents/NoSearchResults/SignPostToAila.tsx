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
  return (
    <PromoBannerWithVideo
      title={title}
      text={text}
      buttonText="Get started"
      buttonIconName="external"
      href={composeAilaLink({ keyStage, subject, unitTitle, searchExpression })}
      videoPlaybackID={videoPlaybackID}
    />
  );
};

export default SignPostToAila;
