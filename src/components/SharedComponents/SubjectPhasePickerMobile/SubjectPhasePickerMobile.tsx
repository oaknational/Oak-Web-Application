import { FC } from "react";
import styled from "styled-components";
import {
  OakBox,
  OakPrimaryButton,
  OakFlex,
  OakHeading,
  OakIcon,
  OakP,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import { sortBy } from "lodash";
import { Hr } from "@/components/SharedComponents/Typography";
import { SubjectPhaseOption } from "@/node-lib/curriculum-api-2023";
import Icon from "@/components/SharedComponents/Icon";
import Box from "@/components/SharedComponents/Box";
import Button from "@/components/SharedComponents/Button";
import OwaLink from "@/components/SharedComponents/OwaLink";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  max-height: 100vh;
  height: 100%;
  z-index: 1000;
`;

const ModalContent = styled(OakBox)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  max-height: 100vh;
  height: 100%;
  overflow-y: auto;
  z-index: 1001;
`;

const ButtonContainer = styled.div`

  &.lot-picker {
    button {
      border: 1px solid var(--Tokens-Border-border-neutral-lighter, #cacaca);
      background: var(--Tokens-Background-bg-primary, #fff);
    }
  }

  &.selected button {
    background-color: #222222;
    color: #fff;
  }

  &.selected img {
    filter: invert(1);
  }
`;

interface SubjectPhasePickerMobileProps {
  subjects: SubjectPhaseOption[];
  showSubjectError: boolean;
  subjectErrorId: string;
  subjectInputId: string;
  handleSelectSubject: (subject: SubjectPhaseOption) => void;
  isSelected: (option: any) => boolean;
  onClose: () => void;
  isCycleTwoEnabled: boolean;
}

const SubjectPhasePickerMobile: FC<SubjectPhasePickerMobileProps> = ({
  subjects,
  showSubjectError,
  subjectErrorId,
  subjectInputId,
  handleSelectSubject,
  isSelected,
  onClose,
  isCycleTwoEnabled,
}) => {
  return (
    <>
      <ModalOverlay onClick={onClose} />
      <ModalContent $pa="inner-padding-xl" $zIndex={300} >
        <OakFlex $flexDirection="column" $gap="space-between-m" >
            <OakFlex $alignItems={"center"} $justifyContent={"space-between"}>
            <Button
            $ma={16}
            $ml={-8}
            size={"large"}
            label="Back"
            data-testid="mobile-done-thread-modal-button"
            icon="chevron-left"
            $iconPosition="leading"
            variant={"minimal"}
            // onClick={handleMobileLotPickerModal}
            />

            <Button
            label=""
            aria-label="Close Menu"
            icon={"cross"}
            variant={"minimal"}
            size={"large"}
            //   onClick={handleMobileLotPickerModal}
            aria-expanded={open}
            />
        </OakFlex>

        <OakHeading tag="h3" $font="heading-5">
            Subject
        </OakHeading>


        {showSubjectError && (
            <OakFlex
                id={subjectErrorId}
                $flexDirection="row"
                $gap="space-between-xs"
            >
                <Icon
                $color="red"
                name="content-guidance"
                verticalAlign="bottom"
                />
                <OakP $color="red">Select a subject to view a curriculum</OakP>
            </OakFlex>
        )}

            <OakFlex $flexDirection="column" $gap="space-between-s">
            <OakHeading
                id={subjectInputId}
                tag="h4"
                $font="heading-6"
            >
                Curriculum plans
            </OakHeading>
            <OakP>
                {isCycleTwoEnabled
                ? "Explore our curricula for 2024/2025."
                : "Explore our new curricula for 2023/2024."}
            </OakP>
            </OakFlex>

            <OakFlex
                role="radiogroup"
                aria-labelledby={subjectInputId}
                aria-required="true"
                aria-describedby={showSubjectError ? subjectErrorId : undefined}
                $flexDirection="row"
                $flexWrap="wrap"
                $gap="space-between-xs"
                $background={"amber"}
            >
                {sortBy(subjects, "title").map((subject) => (
                <ButtonContainer
                    className={`lot-picker ${isSelected(subject) ? "selected" : ""}`}
                    key={subject.slug}
                    $background={"amber"}
                >
                    <OakSecondaryButton
                    role="radio"
                    iconGap="space-between-sssx"
                    onClick={() => {
                        handleSelectSubject(subject);
                        onClose();
                    }}
                    aria-checked={isSelected(subject)}
                    title={subject.title}
                    hoverShadow={null}
                    iconOverride={
                        <OakIcon
                        iconName={getValidSubjectIconName(subject.slug)}
                        alt=""
                        />
                    }
                    >
                    {subject.title}
                    </OakSecondaryButton>
                </ButtonContainer>
                ))}
            </OakFlex>

          <OwaLink
            page="curriculum-previous-downloads"
            $textDecoration="underline"
            $font="heading-7"
          >
            Previously released plans
            <Icon $color="black" name="arrow-right" verticalAlign="bottom" />
          </OwaLink>

          <Box
            $position="fixed"
            $bottom={0}
            $left={0}
            $zIndex={"modalDialog"}
            $display={["block"]}
            $width={"100%"}
            $mh={16}
            $mv={10}
            $background={"white"}
            >
                <Hr $color={"grey40"} $height={1} $mb={10} $ml={-16}/>
                <OakPrimaryButton
                    data-testid="lot-picker-modal-confirm-subject-button"
            iconName="arrow-right"
                    isTrailingIcon={true}
                    onClick={() => handleSelectSubject(subject)}
                >
                    Confirm subject
                </OakPrimaryButton>
            </Box>  
        </OakFlex>
      </ModalContent>
    </>
  );
};

export default SubjectPhasePickerMobile;