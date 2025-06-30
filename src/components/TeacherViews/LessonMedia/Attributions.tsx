import { OakFlex, OakP } from "@oaknational/oak-components";

export const Attributions = ({
  mediaClipsWithAttributions,
}: {
  mediaClipsWithAttributions: Array<{ name: string; attribution: string }>;
}) => {
  return mediaClipsWithAttributions.length ? (
    <OakFlex $flexWrap="wrap">
      {mediaClipsWithAttributions.map((clip) => (
        <OakP $font="body-3">
          <b>{clip.name}</b> &copy; {clip.attribution}.
        </OakP>
      ))}
    </OakFlex>
  ) : null;
};
