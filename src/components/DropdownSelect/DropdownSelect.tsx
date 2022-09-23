import { FC, forwardRef } from "react";

import { FlexProps } from "../Flex";
import Box from "../Box";
import { Span } from "../Typography";
import { IconName } from "../Icon";

import { Select, Item, SelectItem } from "./Select";
import { Label } from "./ListBox";

type SelectChangeHandler = (e: {
  target: { name: string; value: string };
}) => void;

type DropdownSelectProps = FlexProps & {
  id: string;
  listItems: SelectItem[];
  name: string;
  label: string;
  error?: string;
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
    id,
    error,
    listItems,
    name,
    placeholder,
    label,
    onChange,
    icon,
    showLabel,
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
        showLabel={showLabel}
        name={name}
        items={listItems}
        icon={icon}
        onSelectionChange={(value) =>
          onChange({ target: { name, value: String(value) } })
        }
        containerProps={containerProps}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      >
        {(item) => (
          <Item key={item.value} textValue={item.label}>
            <div>
              <Label>{item.label}</Label>
            </div>
          </Item>
        )}
      </Select>
      {error && (
        <Box $position="absolute">
          <Span $color="failure" $font={"body-4"} id={errorId}>
            {error}
          </Span>
        </Box>
      )}
    </>
  );
});

export default DropdownSelect;
