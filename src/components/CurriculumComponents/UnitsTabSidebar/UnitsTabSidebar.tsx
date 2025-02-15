import React, { FC, HTMLProps } from "react";
import { Transition } from "react-transition-group";
import { FocusOn } from "react-focus-on";
import { OakFlex, OakHandDrawnHR, OakBox } from "@oaknational/oak-components";
import styled from "styled-components";

import { SideMenu } from "@/components/AppComponents/AppHeaderMenu";
import MenuBackdrop from "@/components/AppComponents/MenuBackdrop";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { Lesson } from "@/components/CurriculumComponents/UnitModal/UnitModal";
import { IconFocusUnderline } from "@/components/SharedComponents/Button/IconFocusUnderline";
import { Unit } from "@/utils/curriculum/types";

const IconButtonFocusVisible = styled(IconButton)`
  :focus ${IconFocusUnderline} {
    display: none;
  }
  :focus-visible ${IconFocusUnderline} {
    display: block;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 8px;
    transform: rotate(-2deg);
    filter: drop-shadow(1px 2px 0 rgb(0 0 0));
  }
`;

type ModalProps = HTMLProps<HTMLButtonElement> & {
  displayModal: boolean;
  onClose: () => void;
  unitOptionsAvailable?: boolean;
  programmeSlug?: string;
  lessons: Lesson[] | [];
  unitSlug?: string;
  unitVariantID?: number | null;
  unitData?: Unit | null;
};

const UnitsTabSidebar: FC<ModalProps> = ({
  displayModal,
  onClose,
  children,
  unitOptionsAvailable,
  programmeSlug,
  lessons,
  unitSlug,
  unitVariantID,
  unitData,
}) => {
  const getLessonsAvailable = (lessons: Lesson[] | null): boolean => {
    return (
      (lessons &&
        lessons.some((lesson: Lesson) => lesson._state === "published")) ||
      false
    );
  };

  const lessonsAvailable = getLessonsAvailable(lessons);

  let resolvedUnitSlug: string = "";
  if (unitSlug && unitData) {
    if (unitVariantID) {
      const unitOption = unitData?.unit_options?.find(
        ({ unitvariant_id }) => unitvariant_id === unitVariantID,
      );
      resolvedUnitSlug = unitOption?.slug ?? unitSlug;
    } else {
      resolvedUnitSlug = unitSlug;
    }
  }

  return (
    <Transition in={displayModal} timeout={300} unmountOnExit>
      {(state) => (
        <OakBox $position={"absolute"} data-testid="sidebar-modal-wrapper">
          <MenuBackdrop state={state} zIndex={"modalDialog"} />
          <FocusOn
            enabled={displayModal}
            onClickOutside={onClose}
            onEscapeKey={onClose}
          >
            <SideMenu
              data-testid={"sidebar-modal"}
              $position="fixed"
              $top={0}
              $right={0}
              $height="100%"
              $maxWidth="100%"
              $width={["100%", "80%", "50%"]}
              $background={"white"}
              state={state}
              $zIndex={"modalDialog"}
              $overflowY={"scroll"}
            >
              <OakFlex $flexDirection={"column"} $minWidth={"100%"}>
                <OakBox
                  $position={"fixed"}
                  $top="all-spacing-5"
                  $right="all-spacing-4"
                >
                  <IconButtonFocusVisible
                    aria-label="Close Menu"
                    icon={"cross"}
                    variant={"minimal"}
                    size={"large"}
                    onClick={onClose}
                    data-testid="close-button"
                    aria-expanded={displayModal}
                  />
                </OakBox>
                <OakFlex $overflowY={"auto"} $flexGrow={1}>
                  {children}
                </OakFlex>

                {!unitOptionsAvailable && (
                  <OakFlex $flexDirection={"column"}>
                    <OakHandDrawnHR
                      hrColor={"grey30"}
                      $mb={"space-between-m"}
                      $height={"all-spacing-1"}
                    />
                    <OakFlex
                      $justifyContent={"space-between"}
                      $alignItems={["flex-end"]}
                      $ph="inner-padding-m"
                      $pb="inner-padding-m"
                    >
                      <OakFlex
                        $flexDirection={["column", "row"]}
                        $alignItems={"flex-start"}
                        $gap="all-spacing-2"
                      >
                        {lessonsAvailable === false && (
                          <TagFunctional
                            data-testid="coming-soon-flag"
                            text={"Coming soon"}
                            color="grey"
                          />
                        )}
                        {lessons && programmeSlug && unitSlug && (
                          <ButtonAsLink
                            data-testid="unit-lessons-button"
                            label="See lessons in unit"
                            $font={"heading-7"}
                            disabled={!lessonsAvailable}
                            currentStyles={["color"]}
                            icon="chevron-right"
                            iconBackground="black"
                            $iconPosition="trailing"
                            variant="buttonStyledAsLink"
                            page="lesson-index"
                            unitSlug={resolvedUnitSlug}
                            programmeSlug={programmeSlug}
                          />
                        )}
                      </OakFlex>
                    </OakFlex>
                  </OakFlex>
                )}
              </OakFlex>
            </SideMenu>
          </FocusOn>
        </OakBox>
      )}
    </Transition>
  );
};

export default UnitsTabSidebar;
