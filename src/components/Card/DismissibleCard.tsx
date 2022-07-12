import { FC, useState } from "react";
import styled from "styled-components";

import IconButton from "../Button/IconButton";

import Card from "./Card";

const CloseButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
`;

const DismissibleCard: FC = ({ children }) => {
  const [show, setShow] = useState(true);

  return (
    <div>
      {show && (
        <Card background={"white"} mt={48} pr={48} minHeight={0}>
          {children}
          <CloseButtonWrapper>
            <IconButton
              aria-label="Close Beta Banner"
              icon={"Close"}
              onClick={() => {
                setShow(false);
              }}
              variant={"tertiary"}
            />
          </CloseButtonWrapper>
        </Card>
      )}
    </div>
  );
};

export default DismissibleCard;
