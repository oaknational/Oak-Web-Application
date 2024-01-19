import { useRef } from "react";

export const useInitialChange = ({
  onChange,
  onInitialChange,
}: {
  onChange?: () => void;
  onInitialChange?: () => void;
}) => {
  const lastChanged = useRef<number>(0);

  const handleOnChange = () => {
    if (lastChanged.current === 0 && onInitialChange) {
      onInitialChange();
    } else if (lastChanged.current !== 0 && onChange) {
      onChange();
    }
    lastChanged.current = Date.now();
  };

  return { handleOnChange, lastChanged };
};
