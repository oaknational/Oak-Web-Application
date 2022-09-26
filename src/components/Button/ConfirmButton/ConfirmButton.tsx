import { FC, useState } from "react";

import IconButton, { IconButtonProps } from "../IconButton";

const ConfirmButton: FC<IconButtonProps> = (props) => {
  const { icon, onClick } = props;
  const [currentIcon, setCurrentIcon] = useState(icon);

  return (
    <IconButton
      {...props}
      icon={currentIcon}
      onClick={(event) => {
        onClick(event);
        setCurrentIcon("Tick");
      }}
    />
  );
};

export default ConfirmButton;
