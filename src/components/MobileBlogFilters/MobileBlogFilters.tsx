import { FC, useState, useRef, useEffect, useId, useCallback } from "react";

import Box from "../Box";
import Button from "../Button";
import ButtonAsLink from "../Button/ButtonAsLink";
import Flex from "../Flex";
import useEventListener from "../../hooks/useEventListener";
import Cover from "../Cover";
import PostCategoryList, {
  PostCategoryListProps,
  PostCategoryPage,
} from "../Posts/PostCategoryList/PostCategoryList";
import { useMenuContext } from "../../context/Menu";

export type MobileBlogFiltersProps = {
  categoryListProps: Omit<PostCategoryListProps, "labelledBy" | "page">;
  withBackButton?: boolean;
  page: PostCategoryPage;
};
const MobileBlogFilters: FC<MobileBlogFiltersProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryListHeight, setCategoryListHeight] = useState<number>(0);

  const { open } = useMenuContext();
  const menuOpen = open; //rename here to save confusion

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

  const { categoryListProps, withBackButton, page } = props;
  const menuId = useId();
  const triggerId = useId();

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
    <Flex
      $mt={24}
      $display={["flex", "none"]}
      $flexDirection={"column"}
      $width={"100%"}
    >
      <Cover $pointerEvents={isOpen ? null : "none"} onClick={close} />
      <Flex>
        {withBackButton && (
          <Box
            $transition="all 0.5s ease"
            $visibility={isOpen ? "hidden" : "visible"}
            $opacity={isOpen ? 0 : 1}
            aria-hidden={isOpen ? "true" : false}
          >
            <ButtonAsLink
              variant="minimal"
              icon="ArrowLeft"
              iconBackground="teachersHighlight"
              size="large"
              label={`All ${page === "blog-index" ? "blogs" : "webinars"}`}
              page={page}
            />
          </Box>
        )}
        <Button
          id={triggerId}
          $ml="auto"
          variant="minimal"
          icon={isOpen ? "ChevronUp" : "ChevronDown"}
          iconBackground="teachersHighlight"
          $iconPosition="trailing"
          size="large"
          label="Categories"
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          aria-expanded={isOpen}
          aria-controls={menuId}
        />
      </Flex>
      <Box $width={"100%"} $position={"relative"}>
        <Box
          style={{
            height: isOpen ? categoryListHeight : 0,
            clipPath: "inset(0px 0px -15px 0px)",
          }}
          $display={["block", "none"]}
          $position="absolute"
          $transition="all 0.5s ease"
          $width="100%"
          $zIndex="mobileBlogFilters"
          $background={isOpen ? "white" : "transparent"}
          $dropShadow={"grey20"}
        >
          <Box
            id={menuId}
            ref={categoryListRef}
            $top="100%"
            $transform={`translateY(${isOpen ? 0 : "-20%"})`}
            $transition="all 0.5s ease"
            $width="100%"
            $opacity={isOpen ? 1 : 0}
            aria-labelledby={triggerId}
            $visibility={isOpen ? "visible" : "hidden"}
          >
            <PostCategoryList
              labelledBy={triggerId}
              $pv={28}
              $ph={16}
              {...categoryListProps}
              page={page}
            />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default MobileBlogFilters;
