import { FC } from "react";

import { Item, Select } from "../DropDownSelect/Select";
import { IconName } from "../Icon/Icon";

import { Label } from "./ListBox";
export { Section, Item } from "react-stately";

export type SelectedKey = string | number | undefined;

type DropDownSelectProps = {
  listItems: Array<{ id: number; item: string }>;
  name: string;
  placeholder: string;
  label: string;
  selectedKey: SelectedKey;
  icon?: IconName;
  onChange: (key: SelectedKey) => void;
};

const DropDownSelect: FC<DropDownSelectProps> = ({
  listItems,
  name,
  placeholder,
  label,
  onChange,
  selectedKey,
  icon,
}) => {
  return (
    <Select
      data-testid={"select"}
      placeholder={placeholder}
      label={label}
      name={name}
      items={listItems}
      icon={icon}
      selectedKey={selectedKey}
      onSelectionChange={onChange}
    >
      {(item) => (
        <Item key={item.item} textValue={item.item}>
          <div>
            <Label>{item.item}</Label>
          </div>
        </Item>
      )}
    </Select>
  );
};

export default DropDownSelect;
