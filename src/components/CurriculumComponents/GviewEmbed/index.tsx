import { FC } from "react";

type GviewEmbedProps = {
  url: string;
};
const GviewEmbed: FC<GviewEmbedProps> = ({ url }) => {
  return (
    <iframe
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
      key={url}
      src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
        url,
      )}`}
    />
  );
};

export default GviewEmbed;
