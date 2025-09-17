import {
  OakBasicAccordion,
  OakBox,
  OakCheckBox,
  OakFlex,
  OakHeading,
  OakP,
} from "@oaknational/oak-components";
import { FC } from "react";
import styled from "styled-components";

import { ResourcePageLayoutProps } from "../ResourcePageLayout";

const StyledBox = styled(OakBox)`
  &:has(button[aria-expanded="true"]) {
    border-bottom: none;
  }
`;

export type ResourcesAccordionProps = ResourcePageLayoutProps & {
  downloads: string;
};

function Header(props: ResourcesAccordionProps) {
  return (
    <OakFlex
      $justifyContent={"center"}
      $alignItems={"center"}
      $gap={"space-between-xs"}
    >
      <OakBox
        $pa={"inner-padding-xs"}
        onClick={(e) => {
          props.handleToggleSelectAll();
          e.stopPropagation();
        }}
      >
        <OakCheckBox
          onChange={() => undefined}
          checked={props.selectAllChecked}
          id="select-all"
          name="select-all"
          value={""}
        />
      </OakBox>
      <OakFlex
        $flexDirection={"column"}
        $justifyContent={"center"}
        $alignItems={"start"}
      >
        <OakHeading
          $color={"text-primary"}
          $font={"heading-6"}
          $mr={"space-between-s"}
          tag="h2"
        >
          {props.selectAllChecked
            ? "All resources selected"
            : "Select all resources"}
        </OakHeading>

        <OakP>{props.downloads}</OakP>
      </OakFlex>
    </OakFlex>
  );
}

const ResourcesAccordion: FC<ResourcesAccordionProps> = (props) => {
  return (
    <StyledBox
      $bt={"border-solid-s"}
      $bb={"border-solid-s"}
      $borderColor={"grey40"}
    >
      <OakBasicAccordion
        initialOpen={false}
        id={"resourcesAccordion"}
        header={<Header {...props} />}
      >
        <OakBox $pt={"inner-padding-l"}>{props.cardGroup}</OakBox>
      </OakBasicAccordion>
    </StyledBox>
  );
};

export default ResourcesAccordion;
