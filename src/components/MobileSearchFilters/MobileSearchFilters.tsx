import { FC, useState, useRef, useEffect, useId, useCallback } from "react";

import Box from "../Box";
import Button from "../Button";
import Flex from "../Flex";
import useEventListener from "../../hooks/useEventListener";
import Cover from "../Cover";
import { useMenuContext } from "../../context/Menu";

export type MobileSearchFiltersProps = {
  children?: React.ReactNode;
};
const MobileSearchFilters: FC<MobileSearchFiltersProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFiltersHeight, setSearchFiltersHeight] = useState<number>(0);

  const { open: menuOpen } = useMenuContext();

  const searchFiltersRef = useRef<HTMLDivElement>(null);
  const checkAndSetHeight = () => {
    if (searchFiltersRef.current) {
      const boundingRect = searchFiltersRef.current.getBoundingClientRect();
      setSearchFiltersHeight(boundingRect.height);
    }
  };
  useEventListener("resize", () => {
    checkAndSetHeight();
  });
  useEffect(() => {
    checkAndSetHeight();
  }, [searchFiltersRef]);

  const { children } = props;
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
      $display={["flex", "none"]}
      $flexDirection={"column"}
      $width={"100%"}
      $mb={32}
    >
      <Cover $pointerEvents={isOpen ? null : "none"} onClick={close} />
      <Flex>
        <Button
          id={triggerId}
          $ml="auto"
          variant="minimal"
          icon={isOpen ? "Cross" : "Hamburger"}
          iconBackground="teachersHighlight"
          $iconPosition="trailing"
          size="large"
          label={isOpen ? "Close" : "Filters"}
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          aria-expanded={isOpen}
          aria-controls={menuId}
        />
      </Flex>
      <Box $width={"100%"} $position={"relative"}>
        <Box
          style={{
            height: isOpen ? searchFiltersHeight : 0,
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
            ref={searchFiltersRef}
            $top="100%"
            $transform={`translateY(${isOpen ? 0 : "-20%"})`}
            $transition="all 0.5s ease"
            $width="100%"
            $opacity={isOpen ? 1 : 0}
            aria-labelledby={triggerId}
            $visibility={isOpen ? "visible" : "hidden"}
          >
            <Flex $flexDirection={"column"} $pt={32} $pb={32}>
              {children}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default MobileSearchFilters;
