import { FC } from "react";

import ButtonAsLink from "../Button/ButtonAsLink";
import TagPromotional from "../TagPromotional/TagPromotional";
import Flex from "../Flex/Flex";

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
    <Flex $alignItems="center" $gap={10}>
      <ButtonAsLink
        icon={link.external ? "external" : undefined}
        aria-label={link.text}
        label={link.text}
        $iconPosition="trailing"
        iconBackground="transparent"
        variant="minimal"
        size="large"
        {...link.resolveOakHrefProps}
      />
      {link.new && <TagPromotional size="small" />}
    </Flex>
  );
};

export default NewMenuLink;
