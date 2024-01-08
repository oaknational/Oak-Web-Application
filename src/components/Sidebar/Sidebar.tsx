import React, { FC, HTMLProps } from "react";
import { Transition } from "react-transition-group";
import { FocusOn } from "react-focus-on";

import ButtonAsLink from "../SharedComponents/Button/ButtonAsLink";
import Box from "../SharedComponents/Box";
import Flex from "../SharedComponents/Flex";
import IconButton from "../SharedComponents/Button/IconButton";

import { SideMenu } from "@/components/Menu/Menu";
import MenuBackdrop from "@/components/Menu/MenuBackdrop";
import { Hr } from "@/components/Typography";
import { TagFunctional } from "@/components/TagFunctional";
import { Unit } from "@/components/pages/CurriculumInfo/tabs/UnitsTab/UnitsTab";

type ModalProps = HTMLProps<HTMLButtonElement> & {
  displayModal: boolean;
  onClose: () => void;
  unitData?: Unit | null;
  unitOptionsAvailable?: boolean;
  lessonsAvailable?: boolean;
};

const Sidebar: FC<ModalProps> = ({
  displayModal,
  onClose,
  children,
  lessonsAvailable,
  unitData,
  unitOptionsAvailable,
}) => {
  return (
    <Transition in={displayModal} timeout={300} unmountOnExit>
      {(state) => (
        <Box $position={"absolute"}>
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
              <Flex $flexDirection={"column"} $minWidth={"100%"}>
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
                <Flex $overflowY={"auto"} $flexGrow={1}>
                  {children}
                </Flex>

                {!unitOptionsAvailable && (
                  <Flex $flexDirection={"column"}>
                    <Hr $color={"grey30"} $mt={0} $mb={24} />
                    <Flex
                      $justifyContent={"space-between"}
                      $alignItems={["flex-end"]}
                      $ph={16}
                      $pb={16}
                    >
                      <Flex
                        $flexDirection={["column", "row"]}
                        $alignItems={"flex-start"}
                        $gap={8}
                      >
                        {!lessonsAvailable && (
                          <TagFunctional
                            data-testid="coming-soon-flag"
                            text={"Coming soon"}
                            color="grey"
                          />
                        )}
                        {unitData && (
                          <ButtonAsLink
                            data-testid="unit-lessons-button"
                            label="See lessons in unit"
                            $font={"heading-7"}
                            disabled={!lessonsAvailable}
                            currentStyles={["color"]}
                            icon="chevron-right"
                            isCurrent={true}
                            iconBackground="grey60"
                            $iconPosition="trailing"
                            variant="buttonStyledAsLink"
                            page="lesson-index"
                            unitSlug={unitData.slug}
                            programmeSlug={`${unitData.subject_slug}-${unitData.phase_slug}-${unitData.keystage_slug}`}
                          />
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </SideMenu>
          </FocusOn>
        </Box>
      )}
    </Transition>
  );
};

export default Sidebar;
