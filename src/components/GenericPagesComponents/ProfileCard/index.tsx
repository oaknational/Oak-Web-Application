import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakSecondaryLink,
} from "@oaknational/oak-components";

type ProfileCardProps = {
  image?: string;
  name: string;
  role: string;
  href: string;
};
export default function ProfileCard({
  name,
  role,
  href,
  image,
}: Readonly<ProfileCardProps>) {
  return (
    <OakFlex
      $width={"spacing-240"}
      $pa={"spacing-16"}
      $gap={"spacing-16"}
      $flexDirection={"column"}
      $borderRadius={"border-radius-m2"}
    >
      <OakFlex>
        {image && (
          <OakImage
            alt={""}
            $width={"100%"}
            $aspectRatio={"1/1"}
            src={image}
            $objectFit={"cover"}
          />
        )}
        {!image && (
          <OakBox
            $width={"100%"}
            $aspectRatio={"1/1"}
            $background={"bg-neutral"}
          />
        )}
      </OakFlex>
      <OakBox>
        <OakHeading tag="h3" $font={"heading-6"}>
          {name}
        </OakHeading>
      </OakBox>
      <OakBox $font={"body-2"}>{role}</OakBox>
      <OakFlex $font={"heading-light-7"} $justifyContent={"flex-end"}>
        <OakSecondaryLink
          iconName="chevron-right"
          isTrailingIcon={true}
          href={href}
        >
          See bio
        </OakSecondaryLink>
      </OakFlex>
    </OakFlex>
  );
}
