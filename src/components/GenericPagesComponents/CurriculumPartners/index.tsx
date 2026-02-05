import {
  OakBox,
  OakFlex,
  OakGrid,
  OakHeading,
  OakImage,
  OakP,
} from "@oaknational/oak-components";

export type CurriculumPartnersProps = {
  title: string;
  text: string;
  items: {
    imageUrl: string;
    alt: string;
  }[];
};
export function CurriculumPartners({
  title,
  text,
  items,
}: Readonly<CurriculumPartnersProps>) {
  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
      <OakFlex $gap={"spacing-24"} $flexDirection={"column"}>
        <OakFlex $gap={"spacing-8"} $flexDirection={"column"}>
          <OakHeading tag="h3" $font={["heading-5", "heading-4", "heading-4"]}>
            {title}
          </OakHeading>
          <OakP $font={["body-2", "body-1", "body-1"]}>{text}</OakP>
        </OakFlex>
      </OakFlex>
      <OakBox>
        <OakGrid
          $gridTemplateColumns={[
            "repeat(3, 1fr)",
            "repeat(5, 1fr)",
            "repeat(6, 1fr)",
          ]}
          $cg={"spacing-16"}
          $rg={"spacing-16"}
        >
          {items.map((item) => {
            return (
              <OakBox
                key={item.imageUrl}
                $aspectRatio={"1/1"}
                $borderRadius={"border-radius-m"}
                $borderColor={"border-neutral-lighter"}
                $borderStyle={"solid"}
                $position={"relative"}
              >
                <OakImage
                  src={item.imageUrl}
                  $width="100%"
                  $height="100%"
                  alt={item.alt}
                />
              </OakBox>
            );
          })}
        </OakGrid>
      </OakBox>
    </OakFlex>
  );
}
