import { OakBox, OakSpan } from "@oaknational/oak-components";

export const Attributions = ({
  mediaClipsWithAttributions,
}: {
  mediaClipsWithAttributions: Array<{ name: string; attribution: string }>;
}) => {
  return mediaClipsWithAttributions.length ? (
    <OakBox $pv="inner-padding-xl2">
      {mediaClipsWithAttributions.map((clip) => (
        <OakSpan $font="body-3" $color="grey60">
          <b>{clip.name}</b> &copy; {clip.attribution}.{" "}
        </OakSpan>
      ))}
    </OakBox>
  ) : null;
};
