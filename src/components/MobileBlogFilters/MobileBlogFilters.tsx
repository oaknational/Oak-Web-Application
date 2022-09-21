import { useId, usePreventScroll } from "react-aria";
import { FC, useState, useRef, useEffect } from "react";

import BlogCategoryList from "../BlogCategoryList";
import { BlogCategoryListProps } from "../BlogCategoryList/BlogCategoryList";
import Box from "../Box";
import Button from "../Button";
import ButtonAsLink from "../Button/ButtonAsLink";
import Cover from "../Cover";
import Flex from "../Flex";
import useEventListener from "../../hooks/useEventListener";

type MobileBlogFiltersProps = {
  categoryListProps: BlogCategoryListProps;
  withBackButton?: boolean;
};
const MobileBlogFilters: FC<MobileBlogFiltersProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryListHeight, setCategoryListHeight] = useState<number>(0);
  const categoryListRef = useRef<HTMLDivElement>(null);
  const checkAndSetHeight = () => {
    if (categoryListRef.current) {
      const boundingRect = categoryListRef.current.getBoundingClientRect();
      setCategoryListHeight(boundingRect.height);
    }
  };
  useEventListener("resize", () => {
    checkAndSetHeight();
  });
  useEffect(() => {
    checkAndSetHeight();
  }, [categoryListRef]);

  const { categoryListProps, withBackButton } = props;

  const BUTTON_ROW_HEIGHT = 80;

  const close = () => {
    setIsOpen(false);
  };

  usePreventScroll({ isDisabled: !isOpen });

  const menuId = useId();
  const triggerId = useId();

  return (
    <>
      <Box $height={BUTTON_ROW_HEIGHT} $display={[null, "none"]} />
      <Box
        $cover
        $position="fixed"
        $background={"black"}
        $opacity={isOpen ? 0.5 : 0}
        onClick={close}
        $zIndex={"inFront"}
        $pointerEvents={isOpen ? null : "none"}
        $transition="opacity 0.5s ease"
        $display={[null, "none"]}
      />
      <Box
        style={{
          height: isOpen ? BUTTON_ROW_HEIGHT + categoryListHeight : 0,
        }}
        $display={["block", "none"]}
        $position="absolute"
        $transition="all 0.5s ease"
        $width="100%"
        $zIndex="inFront"
        $background={isOpen ? "pastelTurqoise" : "transparent"}
      >
        <Flex
          $justifyContent={"space-between"}
          $alignItems="center"
          $transition="all 0.5s ease"
          $position="relative"
          $height={BUTTON_ROW_HEIGHT}
          $zIndex={"inFront"}
        >
          {withBackButton && (
            <Flex
              $width="50%"
              $background={isOpen ? "white" : "transparent"}
              $transition="all 0.5s ease"
              $height="100%"
              $alignItems="center"
              $position="relative"
            >
              <ButtonAsLink
                variant="minimal"
                icon="ArrowLeft"
                iconBackground="teachersHighlight"
                size="large"
                label="Back"
                href="/"
              />
              <Cover
                $background="black"
                $opacity={isOpen ? 0.5 : 0}
                $transform={`scaleX(${isOpen ? 100 : 99}%)`}
                $pointerEvents={isOpen ? null : "none"}
                $transition="all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                $transformOrigin="left"
                onClick={close}
              />
            </Flex>
          )}
          <Button
            id={triggerId}
            $ml="auto"
            variant="minimal"
            icon={isOpen ? "ChevronUp" : "ChevronDown"}
            iconBackground="teachersHighlight"
            iconPosition="trailing"
            size="large"
            label="Categories"
            onClick={() => setIsOpen((isOpen) => !isOpen)}
            aria-expanded={isOpen}
            aria-controls={menuId}
          />
        </Flex>
        <Box
          id={menuId}
          ref={categoryListRef}
          $top="100%"
          $transform={`translateY(${isOpen ? 0 : "-100%"})`}
          $transition="all 0.5s ease"
          $width="100%"
          $opacity={isOpen ? 1 : 0}
          aria-labelledby={triggerId}
          $visibility={isOpen ? "visible" : "hidden"}
        >
          <BlogCategoryList $pv={32} $ph={16} {...categoryListProps} />
        </Box>
      </Box>
    </>
  );
};

export default MobileBlogFilters;
