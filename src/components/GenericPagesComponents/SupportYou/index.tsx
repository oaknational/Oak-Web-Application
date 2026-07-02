import {
  OakPrimaryButton,
  OakFlex,
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakHeadingProps,
} from "@oaknational/oak-components";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { Image } from "@/common-lib/cms-types";
import CMSImage from "@/components/SharedComponents/CMSImage/CMSImage";

export type SupportYouProps = {
  title: string;
  headingTag?: OakHeadingProps["tag"];
  body: string;
  link: {
    href: string;
    text: string;
  };
  image: Image;
};
export function SupportYou({
  title,
  headingTag = "h2",
  body,
  link,
  image,
}: Readonly<SupportYouProps>) {
  return (
    <OakBox $pv={["spacing-56", "spacing-80", "spacing-80"]}>
      <NewGutterMaxWidth>
        <OakGrid $rg="spacing-24" $cg="spacing-16">
          <OakGridArea $colSpan={[12, 6, 5]}>
            <OakFlex
              $flexDirection="column"
              $gap="spacing-32"
              $flexGrow={1}
              $justifyContent="center"
            >
              <OakFlex $flexDirection="column" $gap="spacing-24">
                <OakHeading
                  $font={["heading-5", "heading-3", "heading-3"]}
                  tag={headingTag}
                >
                  {title}
                </OakHeading>
                <OakP $font="body-1">{body}</OakP>
              </OakFlex>
              <OakFlex $flexDirection="column">
                <OakPrimaryButton
                  iconName="external"
                  isTrailingIcon={true}
                  element="a"
                  href={link.href}
                  target="_blank"
                  aria-label={`${link.text} (opens in new tab)`}
                >
                  {link.text}
                </OakPrimaryButton>
              </OakFlex>
            </OakFlex>
          </OakGridArea>
          <OakGridArea $colStart={[0, 7, 7]} $colSpan={[12, 6, 6]}>
            <OakFlex
              $flexGrow={1}
              $background={"bg-decorative1-subdued"}
              $aspectRatio={"4/3"}
            >
              <CMSImage $objectFit={"cover"} image={image} />
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </NewGutterMaxWidth>
    </OakBox>
  );
}
