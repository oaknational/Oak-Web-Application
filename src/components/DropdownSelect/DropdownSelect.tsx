import { FC, forwardRef } from "react";

import { FlexProps } from "../Flex";
import { IconName } from "../Icon/Icon";

import { Select, Item } from "./Select";
import { Label } from "./ListBox";

type DropdownSelectItem = {
  value: string;
  label: string;
};
type DropdownSelectProps = FlexProps & {
  listItems: Array<DropdownSelectItem>;
  name: string;
  placeholder?: string;
  label?: string;
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
    ...containerProps
  } = props;
  return (
    <Select
      myRef={ref}
      data-testid={"select"}
      placeholder={placeholder}
      label={label}
      aria-label={label || placeholder}
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
