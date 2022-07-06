import { FC, forwardRef } from "react";

import { FlexProps } from "../Flex";
import { IconName } from "../Icon/Icon";

import { Select, Item, SelectItem } from "./Select";
import { Label } from "./ListBox";

type SelectChangeHandler = (e: {
  target: { name: string; value: string };
}) => void;

type DropdownSelectProps = FlexProps & {
  listItems: SelectItem[];
  name: string;
  label: string;
  showLabel?: boolean;
  placeholder?: string;
  icon?: IconName;
  onChange: SelectChangeHandler;
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
      onSelectionChange={(value) =>
        onChange({ target: { name, value: String(value) } })
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
