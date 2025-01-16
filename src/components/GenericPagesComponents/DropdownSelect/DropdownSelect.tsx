import { FC, forwardRef } from "react";
import { OakIconName } from "@oaknational/oak-components";

import FieldError from "@/components/SharedComponents/FieldError";
import {
  Select,
  Item,
  SelectItem,
} from "@/components/GenericPagesComponents/Select";
import { Label } from "@/components/SharedComponents/ListBox/ListBox";
import { FlexProps } from "@/components/SharedComponents/Flex.deprecated";

type SelectChangeHandler = (e: {
  target: { name: string; value: string };
}) => void;

type DropdownSelectProps = FlexProps & {
  id: string;
  listItems: SelectItem[];
  name: string;
  label: string;
  error?: string;
  placeholder?: string;
  icon?: OakIconName;
  onChange: SelectChangeHandler;
  selectedValue?: string;
};

const DropdownSelect: FC<DropdownSelectProps> = forwardRef<
  HTMLButtonElement,
  DropdownSelectProps
>((props, ref) => {
  const {
    id,
    error,
    listItems,
    name,
    placeholder,
    label,
    onChange,
    icon,
    selectedValue,
    ...containerProps
  } = props;

  const errorId = `${id}-error`;

  return (
    <>
      <Select
        myRef={ref}
        data-testid={"select"}
        placeholder={placeholder}
        label={label}
        name={name}
        items={listItems}
        icon={icon}
        onSelectionChange={(value) =>
          onChange({ target: { name, value: String(value) } })
        }
        containerProps={containerProps}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        selectedValue={selectedValue}
      >
        {(item) => (
          <Item
            key={item.value}
            textValue={item.label}
            data-testid={"selectItem"}
          >
            <div>
              <Label>{item.label}</Label>
            </div>
          </Item>
        )}
      </Select>
      <FieldError id={errorId}>{error}</FieldError>
    </>
  );
});

export default DropdownSelect;
