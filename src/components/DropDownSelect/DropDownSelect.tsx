import { FC } from "react";

import { IconName } from "../Icon/Icon";
import { Select, Item, Label } from "../DropDownSelect/Select";

export type SelectedKey = string | number | undefined;

type DropDownSelectProps = {
  listItems: Array<{ id: number; item: string }>;
  name: string;
  placeholder: string;
  label: string;
  icon?: IconName;
  onChange: (key: SelectedKey) => void;
};

const DropDownSelect: FC<DropDownSelectProps> = ({
  listItems,
  name,
  placeholder,
  label,
  onChange,
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
