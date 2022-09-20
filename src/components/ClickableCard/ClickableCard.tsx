import {
  HTMLAttributes,
  DetailedHTMLProps,
  FC,
  MouseEventHandler,
  RefObject,
} from "react";
import styled from "styled-components";

import Flex, { FlexProps } from "../Flex";

const StyledCard = styled(Flex)`
  :hover {
    cursor: pointer;
  }
`;

export type HTMLDivProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "ref"
>;
type ClickableCardProps = FlexProps &
  HTMLDivProps & {
    clickTargetRef: RefObject<HTMLAnchorElement> | RefObject<HTMLButtonElement>;
  };
const ClickableCard: FC<ClickableCardProps> = (props) => {
  //   const clickTargetRef = useRef<HTMLAnchorElement | HTMLLinkElement>(null);
  const { clickTargetRef, ...cardProps } = props;
  //   useEffect(() => {
  //     if (cardRef.current) {
  //       const cardLinks = Array.from(cardRef.current.querySelectorAll("a"));

  //       cardLinks.forEach((el) => {
  //         // this will replaces a click handler on a link e.g. if it has analytics...
  //         // perhaps we should set it explicitly?
  //         el.addEventListener("click", (e) => e.stopPropagation());
  //       });
  //     }
  //   }, [cardRef]);
  const onClick: MouseEventHandler<HTMLDivElement> = () => {
    if (!clickTargetRef.current) {
      // bugsnag
      return;
    }
    const selectedText = window.getSelection()?.toString();
    if (!selectedText) {
      clickTargetRef.current.click();
    }
  };

  return <StyledCard {...cardProps} onClick={onClick} />;
};

export default ClickableCard;
