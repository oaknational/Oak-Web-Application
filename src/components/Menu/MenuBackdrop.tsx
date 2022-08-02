import { FC, useContext } from "react";
import styled from "styled-components";

import { menuContext } from "../../context/Menu/MenuProvider";
import { OakColorName } from "../../styles/theme";
import getColorByName from "../../styles/themeHelpers/getColorByName";

type BackdropProps = {
  background: OakColorName;
  open: boolean;
};

const Backdrop = styled.button<BackdropProps>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 0;
  width: 100vw;
  height: 100vh;
  background: ${(props) => getColorByName(props.background)};
  opacity: ${(props) => (props.open ? "0.4" : "0")};
  pointer-events: ${(props) => (props.open ? "auto" : "none")};
  transition: opacity 0.3s ease-in-out;
`;

const MenuBackdrop: FC = () => {
  const { open, toggleMenu } = useContext(menuContext);
  return (
    <Backdrop
      open={open}
      onClick={() => {
        toggleMenu();
      }}
      background="black"
    />
  );
};

export default MenuBackdrop;
