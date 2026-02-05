import { OakP } from "@oaknational/oak-components";

export const CYCLE_2_SUBJECTS = new Set([
  "art",
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
]);

export const getBannerContent = ({
  isLegacy,
  isCycle2,
  isExpiring,
  hasNewUnits,
  user,
}: {
  isLegacy: boolean;
  isCycle2: boolean;
  isExpiring: boolean;
  hasNewUnits: boolean;
  user: "teacher" | "pupil";
}) => {
  if (!isLegacy || (!isExpiring && !isCycle2)) {
    return null;
  }

  if (isCycle2 && hasNewUnits) {
    // cycle 2 take down where new content exists
    return {
      header: `These ${user === "pupil" ? "lessons" : "resources"} will be removed by the end of the Spring Term 2026.`,
      body:
        user === "pupil" ? (
          "We’ve made brand new and improved lessons for you."
        ) : (
          <OakP>
            Start using our brand new teaching resources now. Designed by
            teachers and subject experts, with real classrooms in mind. The
            older resources below were created for lockdown learning during the
            pandemic and are not designed for classroom teaching.
          </OakP>
        ),
    };
  }

  if (isCycle2 && !hasNewUnits) {
    // cycle 2 takedown where no new content exists, ie. drama and latin
    // todo finalise copy
    return {
      header:
        "These resources were made for remote use during the pandemic, not classroom teaching.",
      body: "Switch to our brand new teaching resources now. Designed by teachers and subject experts, with real classrooms in mind.",
    };
  }

  if (isExpiring && hasNewUnits) {
    // cycle 1 legacy takedown for expiring content
    return {
      header:
        user === "pupil"
          ? "These lessons were made for home learning during the pandemic."
          : "These resources were made for remote use during the pandemic, not classroom teaching.",
      body:
        user === "pupil"
          ? "Take a look at the brand-new and improved lessons we've made for you."
          : "Switch to our new teaching resources now - designed by teachers and leading subject experts, and tested in classrooms.",
    };
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
