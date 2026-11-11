import {
  HeadingAndText,
  HeadingAndTextContent,
} from "../HeadingAndText/HeadingAndText";
import { ImagesSection } from "../ImagesSection/ImagesSection";
import { CalloutSection } from "../CalloutSection/CalloutSection";

export type SectionContent = Array<
  HeadingAndTextContent | ImagesSection | CalloutSection
>;

function renderSection(section: SectionContent[number]) {
  switch (section.type) {
    case "heading-and-text":
      return (
        <HeadingAndText
          key={section.heading}
          heading={section.heading}
          text={section.text}
        />
      );
    case "images":
      return <ImagesSection key={section.id} images={section.images} />;
    case "callout":
      return <CalloutSection key={section.id} quote={section.quote} />;
  }
}

export function SectionContentList({
  content,
}: Readonly<{ content: SectionContent }>) {
  return <>{content.map(renderSection)}</>;
}
