import {
  OakBox,
  OakFlex,
  OakIcon,
  OakSpan,
  OakTypography,
  OakFocusIndicator,
} from "@oaknational/oak-components";
import { VisuallyHidden } from "react-aria";
import styled from "styled-components";
import Link from "next/link";
import { ReactNode } from "react";

import OutlineHeading from "@/components/SharedComponents/OutlineHeading";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { HTMLButtonProps } from "@/components/SharedComponents/Button/common";
import { Unit } from "@/utils/curriculum/types";

const StyledLink = styled(Link)<HTMLButtonProps & { $isHighlighted: boolean }>`
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
  background: ${({ $isHighlighted }) => ($isHighlighted ? "black" : "white")};
  &:hover {
    background: ${({ $isHighlighted }) =>
      $isHighlighted ? "#575757" : "#F2F2F2"};
  }
`;

type CurricUnitCardProps = {
  unit: Unit | Unit["unit_options"][number];
  index: number;
  isHighlighted: boolean;
  href: string;
  onClick?: () => void;
  additional?: ReactNode;
};
export default function CurricUnitCard(props: Readonly<CurricUnitCardProps>) {
  const { href, isHighlighted, unit, index, onClick } = props;
  const isUnitOption = "unit_options" in unit;
  return (
    <OakFocusIndicator
      $height={"100%"}
      $width={"100%"}
      $borderRadius={"border-radius-s"}
      $overflow={"hidden"}
      hoverBackground="bg-decorative6-main"
    >
      <StyledLink
        href={href}
        $isHighlighted={isHighlighted}
        data-testid="unit-info-link"
        shallow={true}
        scroll={false}
        replace={true}
        onClick={onClick}
      >
        <OakFlex
          $pv={"spacing-12"}
          $ph={"spacing-16"}
          $height={"100%"}
          $width={"100%"}
          $color={isHighlighted ? "text-inverted" : "text-primary"}
          data-testid={isHighlighted ? "highlighted-unit-card" : "unit-card"}
          $flexDirection={"column"}
        >
          <OakFlex $flexDirection={"column"} $gap={"spacing-12"}>
            <OutlineHeading tag={"div"} $font={"heading-5"} $fontSize={24}>
              <span aria-hidden={true}>{index + 1}</span>
            </OutlineHeading>
            <OakSpan $font={"heading-7"}>{unit.title}</OakSpan>
            {isUnitOption && unit.unit_options.length > 1 && (
              <OakBox
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
            {props.additional && <OakBox>{props.additional}</OakBox>}
          </OakFlex>

          <OakFlex
            $flexDirection={"row"}
            $justifyContent={"flex-end"}
            $mt={"spacing-16"}
            $flexGrow={1}
            $alignItems={"flex-end"}
          >
            <OakFlex $alignItems={"center"} $gap={"spacing-4"}>
              <OakTypography $font={"heading-7"}>Unit info</OakTypography>

              <OakIcon
                $width="spacing-24"
                $height="spacing-24"
                $colorFilter={isHighlighted ? "text-inverted" : "icon-primary"}
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
    </OakFocusIndicator>
  );
}
