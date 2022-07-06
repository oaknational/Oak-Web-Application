import { FC, forwardRef } from "react";

import { FlexProps } from "../Flex";
import { IconName } from "../Icon/Icon";

import { Select, Item, SelectItem } from "./Select";
import { Label } from "./ListBox";

type DropdownSelectProps = FlexProps & {
  listItems: SelectItem[];
  name: string;
  label: string;
  showLabel?: boolean;
  placeholder?: string;
  icon?: IconName;
  onChange: (e: { target: { name: string; value: string } }) => void;
};

const DropdownSelect: FC<DropdownSelectProps> = forwardRef<
  HTMLButtonElement,
  DropdownSelectProps
>((props, ref) => {
  const {
    listItems,
    name,
    placeholder,
    label,
    onChange,
    icon,
    showLabel,
    ...containerProps
  } = props;

  return (
    <Select
      myRef={ref}
      data-testid={"select"}
      placeholder={placeholder}
      label={label}
      showLabel={showLabel}
      name={name}
      items={listItems}
      icon={icon}
      onSelectionChange={(key) =>
        onChange({ target: { value: String(key), name } })
      }
      containerProps={containerProps}
    >
      {(item) => (
        <Item key={item.value} textValue={item.label}>
          <div>
            <Label>{item.label}</Label>
          </div>
        </Item>
      )}
    </Select>
  );
});

export default DropdownSelect;
