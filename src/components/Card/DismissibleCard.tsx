import { FC, useState } from "react";
import styled from "styled-components";

import IconButton from "../Button/IconButton";

import Card from "./Card";

const CloseButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
`;

type DismissibleCardProps = {
  children?: React.ReactNode;
  // 'title' used for the close button's aria-label
  title: string;
};

const DismissibleCard: FC<DismissibleCardProps> = ({ children, title }) => {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div data-testid="dismissible-card">
      {!dismissed && (
        <Card $background={"white"} $mt={48} $pr={64}>
          {children}
          <CloseButtonWrapper>
            <IconButton
              aria-label={`Dismiss ${title}`}
              icon={"cross"}
              onClick={() => {
                setDismissed(true);
              }}
              variant="minimal"
            />
          </CloseButtonWrapper>
        </Card>
      )}
    </div>
  );
};

export default DismissibleCard;
