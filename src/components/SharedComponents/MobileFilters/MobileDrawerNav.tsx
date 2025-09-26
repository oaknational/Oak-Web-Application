import {
  FC,
  useState,
  useRef,
  useEffect,
  useId,
  useCallback,
  ReactNode,
} from "react";
import styled from "styled-components";
import {
  OakBox,
  OakBoxProps,
  OakFlex,
  OakFlexProps,
} from "@oaknational/oak-components";

import useEventListener from "@/hooks/useEventListener";
import Cover from "@/components/SharedComponents/Cover";
import { useMenuContext } from "@/context/Menu";
import MiniDropdown from "@/components/TeacherComponents/MiniDropdown";

const StyledCategoryList = styled(OakBox)<
  OakBoxProps & { $isOpen: boolean; $categoryListHeight: number }
>`
  clip-path: inset(0px 0px -15px 0px);
  height: ${(props) =>
    props.$isOpen ? `${props.$categoryListHeight}px` : "0px"};
  transition: all 0.5s ease;
`;

const StyledCategoryListInner = styled(OakBox)<
  OakBoxProps & { $isOpen: boolean }
>`
  transform: translateY(${(props) => (props.$isOpen ? 0 : "-20%")});
  top: 100%;
`;

export type MobileDrawerNavProps = {
  children: ReactNode;
  applyForTablet?: boolean;
  label: string;
} & OakFlexProps;
const MobileDrawerNav: FC<MobileDrawerNavProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryListHeight, setCategoryListHeight] = useState<number>(0);

  const { open: menuOpen } = useMenuContext();

  const categoryListRef = useRef<HTMLDivElement>(null);
  const checkAndSetHeight = () => {
    if (categoryListRef.current) {
      const boundingRect = categoryListRef.current.getBoundingClientRect();
      setCategoryListHeight(boundingRect.height + 100);
    }
  };
  useEventListener("resize", () => {
    checkAndSetHeight();
  });
  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  useEffect(() => {
    checkAndSetHeight();
  }, [categoryListRef]);

  useEffect(() => {
    if (isOpen && menuOpen) {
      close();
    }
  }, [isOpen, menuOpen, close]);
  const menuId = useId();
  const triggerId = useId();
  const { children, applyForTablet, label, ...flexProps } = props;

  return (
    <OakFlex
      $mt={props.$mt ?? "space-between-m"}
      $display={["flex", applyForTablet ? "flex" : "none", "none"]}
      $flexDirection={"column"}
      $width={"100%"}
      {...flexProps}
    >
      <Cover $pointerEvents={isOpen ? null : "none"} onClick={close} />
      <MiniDropdown onToggle={setIsOpen} label={label} children={undefined} />
      <OakBox $width={"100%"} $position={"relative"}>
        <StyledCategoryList
          $display={["block", applyForTablet ? "block" : "none", "none"]}
          $background={isOpen ? "white" : "transparent"}
          $isOpen={isOpen}
          $categoryListHeight={categoryListHeight}
          $dropShadow={"drop-shadow-standard"}
          $position="absolute"
          $transition="standard-ease"
          $width="100%"
          $zIndex="mobile-filters"
        >
          <StyledCategoryListInner
            $opacity={isOpen ? "opaque" : "transparent"}
            id={menuId}
            $transition="standard-ease"
            ref={categoryListRef}
            $isOpen={isOpen}
            $width="100%"
            $visibility={isOpen ? "visible" : "hidden"}
            aria-labelledby={triggerId}
          >
            {children}
          </StyledCategoryListInner>
        </StyledCategoryList>
      </OakBox>
    </OakFlex>
  );
};

export default MobileDrawerNav;
