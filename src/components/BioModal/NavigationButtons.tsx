import { RefObject, useEffect } from "react";

import IconButton from "../Button/IconButton";
import ButtonGroup, { ButtonGroupProps } from "../ButtonGroup/ButtonGroup";

type NavigationButtonsProps = ButtonGroupProps & {
  nextBio?: () => void;
  prevBio?: () => void;
  defaultFocusRef: RefObject<HTMLButtonElement>;
};
const NavigationButtons = (props: NavigationButtonsProps) => {
  const { nextBio, prevBio, defaultFocusRef, ...buttonGroupProps } = props;

  useEffect(() => {
    if ((!nextBio || !prevBio) && defaultFocusRef?.current) {
      /**
       * move focus back within the modal when user hits the end or the
       * beginning of the list of people
       **/
      defaultFocusRef.current.focus();
    }
  }, [nextBio, prevBio, defaultFocusRef]);

  return (
    <ButtonGroup {...buttonGroupProps}>
      <IconButton
        icon="arrow-left"
        aria-label="previous board member"
        onClick={prevBio}
        size="small"
        disabled={!prevBio}
      />
      <IconButton
        icon="arrow-right"
        aria-label="next board member"
        onClick={nextBio}
        size="small"
        disabled={!nextBio}
      />
    </ButtonGroup>
  );
};

export default NavigationButtons;
