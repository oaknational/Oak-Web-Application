import { FC, useState, useEffect, useId, useCallback, ReactNode } from "react";
import {
  OakBox,
  OakFlex,
  OakFlexProps,
  OakIconName,
  OakInformativeModal,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { useMenuContext } from "@/context/Menu";
import { PostCategoryPage } from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import { resolveOakHref } from "@/common-lib/urls";

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

  const { open: menuOpen } = useMenuContext();

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
  const definiteId = useId();
  const triggerId = providedId ?? definiteId;

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
      <OakInformativeModal
        isOpen={isOpen}
        onClose={close}
        closeOnBackgroundClick
        aria-labelledby={triggerId}
      >
        <OakFlex
          id={menuId}
          $flexDirection={"column"}
          $width={"100%"}
          $height={"100%"}
          $ph={"spacing-16"}
        >
          {children}
        </OakFlex>
      </OakInformativeModal>
    </OakFlex>
  );
};

export default MobileFilters;
