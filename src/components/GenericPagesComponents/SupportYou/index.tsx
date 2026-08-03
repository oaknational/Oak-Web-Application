import {
  OakPrimaryButton,
  OakFlex,
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakHeadingProps,
  OakImage,
} from "@oaknational/oak-components";

import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { Image } from "@/common-lib/cms-types";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

export type SupportYouProps = {
  link: {
    text: string;
    href: string;
  };
  headingTag?: OakHeadingProps["tag"];
  title?: string;
  text?: string;
  image?: Image;
};

export function SupportYou({
  link,
  headingTag = "h2",
  title = "Discover how Oak can support you",
  text = "To explore the impact Oak’s curricula could have in your school or trust, fill out the form below and one of our experts will be in touch shortly.",
  image = {
    asset: {
      _id: "image-f5112552f3d0d37304f71c7cd63fc18be513a17c-632x454-png",
      url: "https://cdn.sanity.io/images/cuvjke51/production/f5112552f3d0d37304f71c7cd63fc18be513a17c-632x454.png",
    },
  },
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
                <OakP $font="body-1">{text}</OakP>
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
            <OakFlex $flexGrow={1} $aspectRatio={"4/3"}>
              <OakImage
                $objectFit={"contain"}
                src={getProxiedSanityAssetUrl(image.asset?.url) ?? ""}
                alt={image.altText ?? ""}
              />
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </NewGutterMaxWidth>
    </OakBox>
  );
}
