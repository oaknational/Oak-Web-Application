import { useEffect } from "react";
import { useFocusManager } from "react-aria";

import IconButton from "../Button/IconButton";
import ButtonGroup, { ButtonGroupProps } from "../ButtonGroup/ButtonGroup";

type NavigationButtonsProps = ButtonGroupProps & {
  nextBio?: () => void;
  prevBio?: () => void;
};
const NavigationButtons = (props: NavigationButtonsProps) => {
  const { nextBio, prevBio, ...buttonGroupProps } = props;

  const { focusFirst } = useFocusManager();
  useEffect(() => {
    if ((!nextBio || !prevBio) && focusFirst) {
      /**
       * move focus back within the modal when user hits the end or the
       * beginning of the list of people
       **/
      focusFirst();
    }
  }, [nextBio, prevBio, focusFirst]);

  return (
    <ButtonGroup {...buttonGroupProps}>
      <IconButton
        icon="ArrowLeft"
        aria-label="previous board member"
        onClick={prevBio}
        size="small"
        disabled={!prevBio}
      />
      <IconButton
        icon="ArrowRight"
        aria-label="next board member"
        onClick={nextBio}
        size="small"
        disabled={!nextBio}
      />
    </ButtonGroup>
  );
};

export default NavigationButtons;
