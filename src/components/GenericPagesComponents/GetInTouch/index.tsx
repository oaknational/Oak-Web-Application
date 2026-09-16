import {
  OakFlex,
  OakBox,
  OakHeading,
  OakP,
  OakSecondaryButton,
  OakImage,
} from "@oaknational/oak-components";

export type CaseStudyGetInTouchProps = {
  href: string;
  name: string;
  role: string;
  schoolOrMat: string;
  imageUrl: string;
  imageAlt?: string;
};

export function CaseStudyGetInTouch({
  href,
  name,
  role,
  schoolOrMat,
  imageUrl,
  imageAlt,
}: CaseStudyGetInTouchProps) {
  return (
    <OakFlex $gap={"spacing-32"} $flexDirection={["column", "row", "row"]}>
      <OakBox $width="spacing-240" $minWidth="spacing-240">
        <OakBox $aspectRatio={"3 / 4"}>
          <OakImage
            $width="100%"
            $height="100%"
            alt={imageAlt ?? ""}
            src={imageUrl}
          />
        </OakBox>
      </OakBox>
      <OakFlex
        $flexDirection={"column"}
        $gap={["spacing-32", "spacing-40", "spacing-40"]}
        $flexShrink={1}
      >
        <OakHeading
          tag={"h1"}
          $color={"text-primary"}
          $font={["heading-6", "heading-5", "heading-5"]}
        >
          Thank you to {name}, {role} at {schoolOrMat} for sharing their
          feedback to inform this case study
        </OakHeading>
        <OakFlex $flexDirection={"column"} $gap={"spacing-32"}>
          <OakFlex
            $flexDirection={"column"}
            $gap={["spacing-12", "spacing-16", "spacing-16"]}
          >
            <OakHeading
              tag={"h1"}
              $color={"text-primary"}
              $font={["heading-6", "heading-5", "heading-5"]}
            >
              Connect me to schools like this one
            </OakHeading>
            <OakP
              $color={"text-primary"}
              $font={["body-2", "body-1", "body-1"]}
            >
              Interested in exploring how Oak could work for your school or
              trust? We'll connect you with educators on a similar journey, so
              you can ask questions, hear about their experiences and learn what
              has worked for them.
            </OakP>
          </OakFlex>
          <OakSecondaryButton
            rel="noreferrer"
            element="a"
            href={href}
            target="_blank"
            isTrailingIcon={true}
            iconName={"external"}
          >
            Get in touch
          </OakSecondaryButton>
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
}
