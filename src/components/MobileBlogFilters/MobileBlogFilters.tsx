import { useId } from "react-aria";
import { FC, useState, useRef, useEffect } from "react";

import Box from "../Box";
import Button from "../Button";
import ButtonAsLink from "../Button/ButtonAsLink";
import Flex from "../Flex";
import useEventListener from "../../hooks/useEventListener";
import BlogCategoryList, {
  BlogCategoryListProps,
  BlogCategoryPage,
} from "../Blog/BlogCategoryList/BlogCategoryList";
import Cover from "../Cover";

export type MobileBlogFiltersProps = {
  categoryListProps: Omit<BlogCategoryListProps, "labelledBy" | "page">;
  withBackButton?: boolean;
  page: BlogCategoryPage;
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

  const { categoryListProps, withBackButton, page } = props;
  const menuId = useId();
  const triggerId = useId();

  const close = () => {
    setIsOpen(false);
  };

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
          iconPosition="trailing"
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
            <BlogCategoryList
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
