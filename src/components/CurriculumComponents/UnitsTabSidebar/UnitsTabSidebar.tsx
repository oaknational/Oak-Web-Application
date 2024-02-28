import React, { FC, HTMLProps } from "react";
import { Transition } from "react-transition-group";
import { FocusOn } from "react-focus-on";
import { OakFlex } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import { SideMenu } from "@/components/AppComponents/AppHeaderMenu";
import MenuBackdrop from "@/components/AppComponents/MenuBackdrop";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { Hr } from "@/components/SharedComponents/Typography";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { Lesson } from "@/components/CurriculumComponents/UnitModal/UnitModal";

type ModalProps = HTMLProps<HTMLButtonElement> & {
  displayModal: boolean;
  onClose: () => void;
  unitOptionsAvailable?: boolean;
  programmeSlug?: string;
  lessons: Lesson[] | [];
  unitSlug?: string;
  unitVariantID?: number | null;
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
}) => {
  const getLessonsAvailable = (lessons: Lesson[] | null): boolean => {
    return (
      (lessons &&
        lessons.some((lesson: Lesson) => lesson._state === "published")) ||
      false
    );
  };

  const lessonsAvailable = getLessonsAvailable(lessons);

  return (
    <Transition in={displayModal} timeout={300} unmountOnExit>
      {(state) => (
        <Box $position={"absolute"} data-testid="sidebar-modal-wrapper">
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
                <Box $position={"fixed"} $top={20} $right={16}>
                  <IconButton
                    aria-label="Close Menu"
                    icon={"cross"}
                    variant={"minimal"}
                    size={"large"}
                    onClick={onClose}
                    data-testid="close-button"
                    aria-expanded={displayModal}
                  />
                </Box>
                <OakFlex $overflowY={"auto"} $flexGrow={1}>
                  {children}
                </OakFlex>

                {!unitOptionsAvailable && (
                  <OakFlex $flexDirection={"column"}>
                    <Hr $color={"grey30"} $mt={0} $mb={24} />
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
                            unitSlug={
                              unitVariantID
                                ? `${unitSlug}-${unitVariantID}`
                                : unitSlug
                            }
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
        </Box>
      )}
    </Transition>
  );
};

export default UnitsTabSidebar;
