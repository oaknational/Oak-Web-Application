import { FC } from "react";

import IconButton from "../Button/IconButton";

const Menu: FC = (props) => {
  const { children } = props;

  return (
    <nav>
      <IconButton
        icon={"Hamburger"}
        aria-label={"menu"}
        onClick={() => {
          console.log("Open menu");
        }}
        iconColorOverride={"transparent"}
      />
      <div>{children}</div>
    </nav>
  );
};

export default Menu;
