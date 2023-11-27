import {
  FC,
  useState,
  useRef,
  useEffect,
  useId,
  useCallback,
  ReactNode,
} from "react";

import Box from "@/components/Box";
import Button from "@/components/Button";
import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Flex, { FlexProps } from "@/components/Flex";
import useEventListener from "@/hooks/useEventListener";
import Cover from "@/components/Cover";
import { IconName } from "@/components/Icon";
import { useMenuContext } from "@/context/Menu";
import { PostCategoryPage } from "@/components/Posts/PostCategoryList/PostCategoryList";
import { OakColorName } from "@/styles/theme";

export type MobileFiltersProps = {
  withBackButton?: boolean;
  page?: PostCategoryPage;
  children: ReactNode;
  iconOpened?: IconName;
  iconClosed?: IconName;
  label: string;
  labelOpened?: string;
  providedId?: string;
  iconBackground?: OakColorName;
} & FlexProps;
const MobileFilters: FC<MobileFiltersProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryListHeight, setCategoryListHeight] = useState<number>(0);

  const { open: menuOpen } = useMenuContext();

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

  const {
    withBackButton,
    page,
    children,
    iconOpened = "chevron-up",
    iconClosed = "chevron-down",
    label,
    labelOpened = label,
    providedId,
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
    <Flex
      $mt={24}
      $display={["flex", "none"]}
      $flexDirection={"column"}
      $width={"100%"}
      {...flexProps}
    >
      <Cover $pointerEvents={isOpen ? null : "none"} onClick={close} />
      <Flex $alignSelf={props.$alignSelf}>
        {withBackButton &&
          (page === "blog-index" || page === "webinar-index") && (
            <Box
              $transition="all 0.5s ease"
              $visibility={isOpen ? "hidden" : "visible"}
              $opacity={isOpen ? 0 : 1}
              aria-hidden={isOpen ? "true" : false}
            >
              <ButtonAsLink
                variant="minimal"
                icon="arrow-left"
                iconBackground="blue"
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
          icon={isOpen ? iconOpened : iconClosed}
          iconBackground={props.iconBackground ?? "blue"}
          $iconPosition="trailing"
          size="large"
          label={isOpen ? labelOpened : label}
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
          $zIndex="mobileFilters"
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
            {children}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default MobileFilters;
