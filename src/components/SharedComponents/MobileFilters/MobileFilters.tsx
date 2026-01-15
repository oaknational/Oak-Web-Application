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
  OakIconName,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import useEventListener from "@/hooks/useEventListener";
import Cover from "@/components/SharedComponents/Cover";
import { useMenuContext } from "@/context/Menu";
import { PostCategoryPage } from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import { resolveOakHref } from "@/common-lib/urls";

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

export type MobileFiltersProps = {
  withBackButton?: boolean;
  page?: PostCategoryPage;
  children: ReactNode;
  iconOpened?: OakIconName;
  iconClosed?: OakIconName;
  label: string;
  labelOpened?: string;
  providedId?: string;
  applyForTablet?: boolean;
} & OakFlexProps;
const MobileFilters: FC<MobileFiltersProps> = (props) => {
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
  useEffect(() => {
    checkAndSetHeight();
  }, [categoryListRef]);

  const {
    withBackButton,
    page,
    children,
    iconOpened = "chevron-up",
    iconClosed = "chevron-down",
    label,
    labelOpened = label,
    providedId,
    applyForTablet,
    ...flexProps
  } = props;

  const menuId = useId();

  // Allow the ID to passed in from that parent component
  // for labelling of nested child components.
  let triggerId = providedId;
  const definiteId = useId();
  if (triggerId === undefined) {
    triggerId = definiteId;
  }

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // Close the dropdown if the menu is open
  useEffect(() => {
    if (isOpen && menuOpen) {
      close();
    }
  }, [isOpen, menuOpen, close]);

  return (
    <OakFlex
      $mt={props.$mt ?? "spacing-24"}
      $display={["flex", applyForTablet ? "flex" : "none", "none"]}
      $flexDirection={"column"}
      $width={"100%"}
      $alignItems={"flex-end"}
      {...flexProps}
    >
      <Cover $pointerEvents={isOpen ? null : "none"} onClick={close} />
      <OakFlex
        $alignSelf={props.$alignSelf}
        $align-items={"center"}
        $justifyContent={"space-between"}
        $width={withBackButton ? "100%" : "auto"}
      >
        {withBackButton &&
          (page === "blog-index" || page === "webinar-index") && (
            <OakBox
              $transition="standard-ease"
              $visibility={isOpen ? "hidden" : "visible"}
              $opacity={isOpen ? "transparent" : "opaque"}
              aria-hidden={isOpen ? "true" : false}
            >
              <OakTertiaryButton
                iconName="arrow-left"
                element="a"
                href={resolveOakHref({ page })}
              >
                {`All ${page === "blog-index" ? "blogs" : "webinars"}`}
              </OakTertiaryButton>
            </OakBox>
          )}
        <OakTertiaryButton
          id={triggerId}
          $ml="auto"
          iconName={isOpen ? iconOpened : iconClosed}
          isTrailingIcon
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          aria-expanded={isOpen}
          aria-controls={menuId}
          $pointerEvents={"all"}
        >
          {isOpen ? labelOpened : label}
        </OakTertiaryButton>
      </OakFlex>
      <OakBox $width={"100%"} $position={"relative"}>
        <StyledCategoryList
          $isOpen={isOpen}
          $categoryListHeight={categoryListHeight}
          $display={["block", applyForTablet ? "block" : "none", "none"]}
          $position="absolute"
          $transition="standard-ease"
          $width="100%"
          $zIndex="mobile-filters"
          $background={isOpen ? "bg-inverted" : "transparent"}
          $dropShadow={"drop-shadow-standard"}
          $pointerEvents={"all"}
        >
          <StyledCategoryListInner
            id={menuId}
            ref={categoryListRef}
            $isOpen={isOpen}
            $transition="standard-ease"
            $width="100%"
            $opacity={isOpen ? "opaque" : "transparent"}
            aria-labelledby={triggerId}
            $visibility={isOpen ? "visible" : "hidden"}
          >
            {children}
          </StyledCategoryListInner>
        </StyledCategoryList>
      </OakBox>
    </OakFlex>
  );
};

export default MobileFilters;
