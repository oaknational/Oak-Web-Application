import { OakFlex, OakLink, OakP } from "@oaknational/oak-components";

export const CYCLE_2_SUBJECTS = new Set([
  "art",
  "citizenship",
  "computing",
  "design-technology",
  "geography",
  "french",
  "german",
  "spanish",
  "music",
  "physical-education",
  "religious-education",
  "rshe-pshe",
  "drama",
  "latin",
]);

const getCycle2WithNewUnitsContent = (
  user: "teacher" | "pupil",
  isSingle?: boolean,
) => {
  const pupilHeader = `${isSingle ? "This lesson" : "These lessons"} will be removed by the end of the Spring Term 2026.`;
  const teacherHeader = `These resources will be removed by the end of the Spring Term 2026.`;
  return {
    header: user === "pupil" ? pupilHeader : teacherHeader,
    body:
      user === "pupil" ? (
        "We've made brand new and improved lessons for you."
      ) : (
        <OakFlex $flexDirection={"column"} $gap="spacing-20">
          <OakP>
            Start using our brand new teaching resources now. Designed by
            teachers and subject experts, with real classrooms in mind.{" "}
          </OakP>
          <OakP>
            The older resources below were created for lockdown learning during
            the pandemic and are not designed for classroom teaching.
          </OakP>
        </OakFlex>
      ),
  };
};

const getCycle2WithoutNewUnitsContent = (
  user: "teacher" | "pupil",
  isSingle?: boolean,
) => {
  const helpArticleHref =
    "https://support.thenational.academy/lesson-unavailable";
  const pupilHeader = `${isSingle ? "This lesson" : "These lessons"} will be removed by the end of the Spring Term 2026.`;
  const teacherHeader = `These resources will be removed by the end of the Spring Term 2026.`;

  return {
    header: user === "pupil" ? pupilHeader : teacherHeader,
    body:
      user === "pupil" ? (
        <OakP $textWrap="balance">
          These resources below were created for lockdown learning during the
          pandemic and will be removed soon. See our{" "}
          <OakLink
            href={helpArticleHref}
            target="_blank"
            rel="external"
            isTrailingIcon
            iconName="external"
          >
            help article
          </OakLink>{" "}
          for more information.
        </OakP>
      ) : (
        <OakP $textWrap="balance">
          These resources below were created for lockdown learning during the
          pandemic and are not designed for classroom teaching. You may want to
          download these resources to save them and check any links you've saved
          or shared. See our{" "}
          <OakLink
            href={helpArticleHref}
            target="_blank"
            rel="external"
            isTrailingIcon
            iconName="external"
            aria-label="help article (opens in a new tab)"
          >
            help article
          </OakLink>{" "}
          for more information.
        </OakP>
      ),
  };
};

const getExpiringWithNewUnitsContent = (
  user: "teacher" | "pupil",
  isSingle?: boolean,
) => {
  const pupilHeader = `${isSingle ? "This lesson was" : "These lessons were"} made for lockdown learning during the pandemic`;
  return {
    header:
      user === "pupil"
        ? pupilHeader
        : "These resources were made for remote use during the pandemic, not classroom teaching.",
    body:
      user === "pupil"
        ? "We've made brand-new and improved lessons for you."
        : "Switch to our brand-new teaching resources now. Designed by teachers and subject experts, with real classrooms in mind",
  };
};

export const getBannerContent = ({
  isCycle2,
  isExpiring,
  hasNewUnits,
  user,
  isSingle,
}: {
  isCycle2: boolean;
  isExpiring: boolean;
  hasNewUnits: boolean;
  user: "teacher" | "pupil";
  isSingle?: boolean;
}) => {
  if (isCycle2 && hasNewUnits) {
    // cycle 2 take down where new content exists
    return getCycle2WithNewUnitsContent(user, isSingle);
  }

  if (isCycle2 && !hasNewUnits) {
    // cycle 2 takedown where no new content exists, ie. drama and latin
    return getCycle2WithoutNewUnitsContent(user, isSingle);
  }

  if (isExpiring && hasNewUnits) {
    // cycle 1 legacy takedown for expiring content
    return getExpiringWithNewUnitsContent(user, isSingle);
  }

  // default, content being expired where no new content exists
  return {
    header: "New units on the way!",
    body: (
      <>
        <OakP>
          These resources were made for remote use during the pandemic, not
          classroom teaching.
        </OakP>
        <OakP $mt={"spacing-24"}>We're busy creating new lessons for you.</OakP>
      </>
    ),
  };
};
