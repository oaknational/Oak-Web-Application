import {
  HeadingAndText,
  HeadingAndTextContent,
} from "../HeadingAndText/HeadingAndText";
import { ImagesSection } from "../ImagesSection/ImagesSection";

export type SectionContent = Array<HeadingAndTextContent | ImagesSection>;

export function SectionContentList({
  content,
}: Readonly<{ content: SectionContent }>) {
  return (
    <>
      {content.map((section) =>
        section.type === "heading-and-text" ? (
          <HeadingAndText
            key={section.heading}
            heading={section.heading}
            text={section.text}
          />
        ) : (
          <ImagesSection key={section.id} images={section.images} />
        ),
      )}
    </>
  );
}
