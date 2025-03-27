import { useRef, useContext, createContext } from "react";
import styled from "styled-components";
import type { AriaListBoxOptions } from "@react-aria/listbox";
import type { Node } from "@react-types/shared";
import type { ListState } from "react-stately";
import { useListBox, useOption } from "react-aria";
import {
  OakLI,
  OakFlex,
  OakSpan,
  OakCombinedColorToken,
} from "@oaknational/oak-components";

import { InputFocusUnderline } from "@/components/SharedComponents/Input/Input";
import theme, { OakColorName } from "@/styles/theme";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";

export type SelectListBoxConfig = {
  states: {
    default: {
      background: OakColorName;
      color: OakCombinedColorToken;
    };
    isFocused: {
      background: OakColorName;
      color: OakColorName;
      weight: number;
    };
    isFocusedSelected: {
      color: OakColorName;
    };
    isFocusedNotSelected: {
      color: OakColorName;
    };
  };
};

const List = styled.ul`
  max-height: 300px;
  overflow: auto;
  list-style: none;
  padding: 0;
  margin: 4px 0;
  outline: none;
`;

const ListItem = styled(OakLI)<ListItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: default;
  outline: none;
  width: 100%;

  &:focus-within ${InputFocusUnderline} {
    display: inline;
  }
`;

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  listBoxRef?: React.RefObject<HTMLUListElement>;
  state: ListState<unknown>;
}

interface OptionProps {
  item: Node<unknown>;
  state: ListState<unknown>;
}

interface ListItemProps {
  isFocused?: boolean;
  isSelected?: boolean;
}

export function ListBox(props: ListBoxProps) {
  const ref = useRef<HTMLUListElement>(null);
  const { listBoxRef = ref, state } = props;
  const { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <List {...listBoxProps} ref={listBoxRef}>
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </List>
  );
}

interface OptionContextValue {
  labelProps: React.HTMLAttributes<HTMLElement>;
  descriptionProps: React.HTMLAttributes<HTMLElement>;
}

const OptionContext = createContext<OptionContextValue>({
  labelProps: {},
  descriptionProps: {},
});

function Option({ item, state }: OptionProps) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, labelProps, descriptionProps, isSelected, isFocused } =
    useOption(
      {
        key: item.key,
      },
      state,
      ref,
    );

  return (
    <ListItem
      {...optionProps}
      ref={ref}
      isFocused={isFocused}
      isSelected={isSelected}
      $font={"heading-light-7"}
      data-testid="listbox-option"
    >
      <OakFlex
        $width={"100%"}
        $background={isFocused ? "grey20" : "white"}
        $position={"relative"}
        $alignItems={"center"}
        $pa="inner-padding-xs"
        $pl="inner-padding-m"
      >
        <OptionContext.Provider value={{ labelProps, descriptionProps }}>
          {item.rendered}
        </OptionContext.Provider>
      </OakFlex>
      <BoxBorders $color="black" hideTop />
    </ListItem>
  );
}

// The Label and Description components will be used within an <Item>.
// They receive props from the OptionContext defined above.
// This ensures that the option is ARIA labelled by the label, and
// described by the description, which makes for better announcements
// for screen reader users.

export function Label({ children }: { children: React.ReactNode }) {
  const { labelProps } = useContext(OptionContext);
  return (
    <OakSpan
      $color={theme.selectListBox?.states?.default?.color || "black"}
      {...labelProps}
    >
      {children}
    </OakSpan>
  );
}

const StyledDescription = styled.div`
  font-weight: normal;
  font-size: 12px;
`;

export function Description({ children }: { children: React.ReactNode }) {
  const { descriptionProps } = useContext(OptionContext);
  return (
    <OakFlex>
      <StyledDescription {...descriptionProps}>{children}</StyledDescription>
    </OakFlex>
  );
}
