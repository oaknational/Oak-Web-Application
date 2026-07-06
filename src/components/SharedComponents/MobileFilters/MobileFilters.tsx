import { FC, useState, useEffect, useCallback, ReactNode } from "react";
import {
  OakBox,
  OakFlex,
  OakFlexProps,
  OakInformativeModal,
  OakPrimaryButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { useMenuContext } from "@/context/Menu";
import { PostCategoryPage } from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import { resolveOakHref } from "@/common-lib/urls";

export type MobileFiltersProps = {
  withBackButton?: boolean;
  page?: PostCategoryPage;
  children: ReactNode;
  label: string;
} & OakFlexProps;
const MobileFilters: FC<MobileFiltersProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { open: menuOpen } = useMenuContext();

  const { withBackButton, page, children, label, ...flexProps } = props;

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
      $display={["flex", "none", "none"]}
      $flexDirection={"column"}
      $width={"100%"}
      $alignItems={"flex-end"}
      {...flexProps}
    >
      <OakFlex
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
          $ml="auto"
          iconName={"filter"}
          isTrailingIcon
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          $pointerEvents={"all"}
          aria-haspopup="dialog"
        >
          {label}
        </OakTertiaryButton>
      </OakFlex>
      <OakInformativeModal
        isOpen={isOpen}
        onClose={close}
        closeOnBackgroundClick
        aria-label={label}
        footerSlot={
          <OakBox
            $pa={"spacing-12"}
            $bt={"border-solid-s"}
            $borderColor={"border-neutral-lighter"}
          >
            <OakPrimaryButton
              data-testid="mobile-done-thread-modal-button"
              onClick={() => setIsOpen(false)}
            >
              Show results
            </OakPrimaryButton>
          </OakBox>
        }
      >
        <OakFlex
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
