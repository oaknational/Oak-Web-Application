import { FC } from "react";
import styled from "styled-components";
import { usePreventScroll } from "react-aria";

import { useMenuContext } from "../../context/Menu/";
import { OakColorName } from "../../styles/theme";
import getColorByName from "../../styles/themeHelpers/getColorByName";

import { TransitionProps } from "./Menu";

type BackdropProps = {
  background: OakColorName;
};

const Backdrop = styled.button<BackdropProps & TransitionProps>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 0;
  width: 100vw;
  height: 100vh;
  background: ${(props) => getColorByName(props.background)};
  transition: opacity 250ms ease-in-out;
  opacity: ${(props) => {
    switch (props.state) {
      case "entering":
        return "0.4";
      case "entered":
        return "0.4";
      case "exiting":
        return "0";
      case "exited":
        return "0";
    }
  }};
`;

const MenuBackdrop: FC<TransitionProps> = ({ state }) => {
  const { toggleMenu } = useMenuContext();
  usePreventScroll();
  return (
    <Backdrop
      onClick={() => {
        toggleMenu();
      }}
      background="black"
      state={state}
    />
  );
};

export default MenuBackdrop;
