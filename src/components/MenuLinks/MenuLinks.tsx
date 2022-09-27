import { FC } from "react";

import { MenuLinkSize, MenuLinksProps } from "./types";
import MenuLink from "./MenuLink";

const MenuLinks: FC<MenuLinksProps> = (props) => {
  const { menuSections } = props;

  return (
    <ul role="list">
      {Object.entries(menuSections).map(([size, links]) => {
        return links.map((link, i) => {
          const isFirst = i === 0;
          return (
            <MenuLink
              size={size as MenuLinkSize}
              key={link.linkText}
              isFirstOfSection={isFirst}
              {...link}
            />
          );
        });
      })}
    </ul>
  );
};

export default MenuLinks;
