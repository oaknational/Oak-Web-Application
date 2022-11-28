import { FC } from "react";
import styled from "styled-components";
import { usePreventScroll } from "react-aria";

import { OakColorName } from "../../styles/theme";
import getColorByName from "../../styles/themeHelpers/getColorByName";

import { TransitionProps } from "./Menu";

type BackdropProps = {
  background: OakColorName;
};

/**
 * Making this a div rather than a button so that it's not exposed to the
 * accessiblity api (there is already an accessible close menu button)
 */
const Backdrop = styled.div<BackdropProps & TransitionProps>`
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
  visibility: ${(props) => {
    switch (props.state) {
      case "entering":
        return "visible";
      case "entered":
        return "visible";
      case "exiting":
        return "visible";
      case "exited":
        return "hidden";
    }
  }};
`;

const MenuBackdrop: FC<TransitionProps> = ({ state }) => {
  usePreventScroll({ isDisabled: state === "exited" });
  return (
    <Backdrop background="black" state={state} data-testid={"menu-backdrop"} />
  );
};

export default MenuBackdrop;
