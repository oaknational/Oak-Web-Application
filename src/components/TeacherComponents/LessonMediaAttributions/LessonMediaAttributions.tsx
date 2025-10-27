import { OakBox, OakSpan } from "@oaknational/oak-components";

export const LessonMediaAttributions = ({
  mediaClipsWithAttributions,
}: {
  mediaClipsWithAttributions: Array<{ name: string; attribution: string }>;
}) => {
  return mediaClipsWithAttributions.length ? (
    <OakBox $pv="inner-padding-xl2" data-testid="media-attributions">
      {mediaClipsWithAttributions.map((clip) => (
        <OakSpan
          $font="body-3"
          $color="grey60"
          key={clip.name + clip.attribution}
        >
          <OakSpan $font="body-3-bold">{clip.name}</OakSpan>{" "}
          {clip.attribution.startsWith("©") ? " " : "© "}
          {clip.attribution}.{" "}
        </OakSpan>
      ))}
    </OakBox>
  ) : null;
};
