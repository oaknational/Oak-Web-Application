import { PortableText } from "@portabletext/react";

import { OakBox, OakHeading, OakPrimaryButton } from "@/styles/oakThemeApp";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import CMSImage from "@/components/SharedComponents/CMSImage";
import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types";

export default function JoinResearchPanelPageHeader({
  title,
  bodyRaw,
  image,
  button,
}: JoinResearchPanelPageBlock<"JoinResearchPanelPageHeader">) {
  return (
    <OakBox>
      <OakHeading tag="h1"> {title} </OakHeading>
      <PortableText value={bodyRaw} />
      <OakPrimaryButton
        element="a"
        href={getLinkHref(button)}
        iconName="external"
        isTrailingIcon
      >
        {button.label}
      </OakPrimaryButton>
      <CMSImage image={image} />
    </OakBox>
  );
}
