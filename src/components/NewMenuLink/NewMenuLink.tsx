import { FC } from "react";

import ButtonAsLink from "../Button/ButtonAsLink";

import { ResolveOakHrefProps } from "@/common-lib/urls";

export type BetaMenuLink = {
  resolveOakHrefProps: ResolveOakHrefProps;
  text: string;
  new: boolean;
  external: boolean;
};

export type NewMenuLinkProps = {
  link: BetaMenuLink;
};

const NewMenuLink: FC<NewMenuLinkProps> = (props) => {
  const { link } = props;

  return (
    <ButtonAsLink
      icon="external"
      aria-label={link.text}
      label={link.text}
      $iconPosition="trailing"
      iconBackground="transparent"
      variant="minimal"
      size="large"
      {...link.resolveOakHrefProps}
    />
  );
};

export default NewMenuLink;
