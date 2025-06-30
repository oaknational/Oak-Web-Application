import { OakBox, OakSpan } from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";

export const LessonMediaAttributions = ({
  mediaClipsWithAttributions,
}: {
  mediaClipsWithAttributions: Array<{ name: string; attribution: string }>;
}) => {
  const featureFlagActive = useFeatureFlagEnabled(
    "teachers-copyright-restrictions",
  );
  return mediaClipsWithAttributions.length && featureFlagActive ? (
    <OakBox $pv="inner-padding-xl2" data-testid="media-attributions">
      {mediaClipsWithAttributions.map((clip) => (
        <OakSpan
          $font="body-3"
          $color="grey60"
          key={clip.name + clip.attribution}
        >
          <b>{clip.name}</b> &copy; {clip.attribution}.{" "}
        </OakSpan>
      ))}
    </OakBox>
  ) : null;
};
