import React, { FC, HTMLProps } from "react";
import { Transition } from "react-transition-group";
import { FocusOn } from "react-focus-on";

import Box from "@/components/Box";
import { SideMenu } from "@/components/Menu/Menu";
import MenuBackdrop from "@/components/Menu/MenuBackdrop";
import Flex from "@/components/Flex";
import IconButton from "@/components/Button/IconButton";
import { Hr } from "@/components/Typography";
import Button from "@/components/Button";
import { TagFunctional } from "@/components/TagFunctional";
import { Unit } from "@/components/pages/CurriculumInfo/tabs/UnitsTab/UnitsTab";

type ModalProps = HTMLProps<HTMLButtonElement> & {
  displayModal: boolean;
  onClose: () => void;
  unitData?: Unit | null;
};

const Sidebar: FC<ModalProps> = ({
  displayModal,
  onClose,
  children,
  unitData,
}) => {
  let unitOptionsAvailable = false;
  if (unitData) {
    unitOptionsAvailable = unitData.unit_options.length > 0 ? true : false;
  }
  return (
    <Transition in={displayModal} timeout={300}>
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
                <Flex $flexDirection={"column"}>
                  <Hr $color={"oakGrey2"} $mt={0} $mb={24} />
                  <Flex
                    $justifyContent={"space-between"}
                    $alignItems={["flex-end"]}
                    $ph={16}
                    $pb={16}
                  >
                    <Button
                      data-testid="close-button"
                      icon="cross"
                      aria-label="Close"
                      size="large"
                      label={"Close"}
                      $iconPosition={"trailing"}
                      variant="minimal"
                      onClick={onClose}
                      aria-expanded={displayModal}
                      $hoverStyles={["underline-link-text"]}
                    />
                    {!unitOptionsAvailable && (
                      <Flex
                        $flexDirection={["column", "row"]}
                        $alignItems={"flex-start"}
                      >
                        <TagFunctional text={"Coming soon"} color="grey" />
                        <Button
                          data-testid="unit-lessons-button"
                          disabled={true}
                          label="See lessons in unit"
                          $font={"heading-7"}
                          isCurrent={true}
                          currentStyles={["color"]}
                          icon="chevron-right"
                          iconBackground="oakGrey4"
                          $iconPosition="trailing"
                          variant="buttonStyledAsLink"
                        />
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </SideMenu>
          </FocusOn>
        </Box>
      )}
    </Transition>
  );
};

export default Sidebar;
