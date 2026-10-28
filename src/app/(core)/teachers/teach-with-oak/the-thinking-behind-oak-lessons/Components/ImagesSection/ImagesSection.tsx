import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
} from "@oaknational/oak-components";

type Image = {
  src: string;
  alt: string;
  height: number;
  width: number;
  caption?: string;
  heading?: string;
};
export type ImagesSection = { type: "images"; id: string; images: Image[] };

export function ImagesSection({
  images,
}: Readonly<{ images: ImagesSection["images"] }>) {
  return (
    <section>
      <OakHeading
        $font={["heading-7", "heading-6", "heading-6"]}
        tag="h3"
        $mb={"spacing-16"}
      >
        What does this look like in Oak lessons?
      </OakHeading>
      {images.map((image) => (
        <OakFlex $flexDirection={"column"} $gap={"spacing-16"} key={image.src}>
          <OakBox $mb="spacing-16">
            {image.heading && (
              <OakHeading $font={"body-1-bold"} tag="h4" $mb={"spacing-16"}>
                {image.heading}
              </OakHeading>
            )}
            <OakImage
              $minWidth={"100%"}
              height={image.height}
              width={image.width}
              sizes="(max-width: 640px) 100vw, 640px"
              src={image.src}
              alt={image.alt}
            />
            {image.caption && <OakP $ml="spacing-8">{image.caption}</OakP>}
          </OakBox>
        </OakFlex>
      ))}
    </section>
  );
}
