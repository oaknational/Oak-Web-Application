import {
  OakBox,
  OakFlex,
  OakIcon,
  OakSpan,
  OakTypography,
} from "@oaknational/oak-components";
import { VisuallyHidden } from "react-aria";
import styled from "styled-components";
import Link from "next/link";

import FocusIndicator from "../OakComponentsKitchen/FocusIndicator";

import OutlineHeading from "@/components/SharedComponents/OutlineHeading";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { HTMLButtonProps } from "@/components/SharedComponents/Button/common";
import { Unit } from "@/utils/curriculum/types";

const StyledLink = styled(Link)<HTMLButtonProps & { isHighlighted: boolean }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  display: block;
  text-align: left;
  outline: none;
  cursor: pointer;
  background: ${({ isHighlighted }) => (isHighlighted ? "black" : "white")};
  &:hover {
    background: ${({ isHighlighted }) =>
      isHighlighted ? "#575757" : "#F2F2F2"};
  }
`;

type CurricUnitCardProps = {
  unit: Unit | Unit["unit_options"][number];
  index: number;
  isHighlighted: boolean;
  href: string;
};
export default function CurricUnitCard(props: CurricUnitCardProps) {
  const { href, isHighlighted, unit, index } = props;
  const isUnitOption = "unit_options" in unit;
  return (
    <FocusIndicator
      $height={"100%"}
      $width={"100%"}
      $borderRadius={"border-radius-s"}
      $overflow={"hidden"}
      disableMouseHover={isHighlighted}
    >
      <StyledLink
        href={href}
        isHighlighted={isHighlighted}
        data-testid="unit-info-link"
        shallow={true}
        scroll={false}
        replace={true}
      >
        <OakFlex
          $pv={"inner-padding-s"}
          $ph={"inner-padding-m"}
          $height={"100%"}
          $width={"100%"}
          $color={isHighlighted ? "white" : "black"}
          data-testid={isHighlighted ? "highlighted-unit-card" : "unit-card"}
          $flexDirection={"column"}
        >
          <OakBox>
            <OutlineHeading
              tag={"div"}
              $font={"heading-5"}
              $fontSize={24}
              $mb={12}
            >
              <span aria-hidden={true}>{index + 1}</span>
            </OutlineHeading>
            <OakSpan $font={"heading-7"}>{unit.title}</OakSpan>
            {isUnitOption && unit.unit_options.length > 1 && (
              <OakBox
                $mt={"space-between-xs"}
                $mb={"space-between-m"}
                $zIndex={"neutral"}
                data-testid="options-tag"
                $position={"relative"}
              >
                <TagFunctional
                  color="lavender"
                  text={`${unit.unit_options.length} unit options`}
                />
              </OakBox>
            )}
          </OakBox>

          <OakFlex
            $flexDirection={"row"}
            $justifyContent={"flex-end"}
            $mt={"space-between-s"}
            $flexGrow={1}
            $alignItems={"flex-end"}
          >
            <OakFlex $alignItems={"center"} $gap={"space-between-sssx"}>
              <OakTypography $font={"heading-7"}>Unit info</OakTypography>

              <OakIcon
                $width="all-spacing-6"
                $height="all-spacing-6"
                $colorFilter={isHighlighted ? "white" : "black"}
                alt=""
                iconName="chevron-right"
              />
            </OakFlex>
          </OakFlex>
          {isHighlighted && (
            <VisuallyHidden>&nbsp;(highlighted)</VisuallyHidden>
          )}
        </OakFlex>
      </StyledLink>
    </FocusIndicator>
  );
}
