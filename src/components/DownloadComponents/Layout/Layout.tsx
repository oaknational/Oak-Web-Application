import { FC, useEffect, useState } from "react";

import { Heading } from "@/components/Typography";
import FieldError from "@/components/FormFields/FieldError";
import Box from "@/components/Box";
import Checkbox from "@/components/Checkbox";
import Flex from "@/components/Flex";

/** Generic layout component for Downloads and Share page */

type LayoutProps = {
  header: string;
  onSelectAllClick: () => void;
  onDeselectAllClick: () => void;
  preselectAll: boolean;
  errorMessage?: string;
  cardGroup: React.ReactNode;
  triggerForm: () => void;
};

const Layout: FC<LayoutProps> = (props) => {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  useEffect(() => {
    if (props.preselectAll) {
      setSelectAllChecked(true);
    }
  }, [props.preselectAll]);

  const handleToggleSelectAll = () => {
    if (selectAllChecked) {
      props.onDeselectAllClick();
      setSelectAllChecked(false);
    } else {
      props.onSelectAllClick();
      setSelectAllChecked(true);
    }
    // Trigger the form to reevaluate errors
    props.triggerForm();
  };

  return (
    <Box>
      <Flex
        $alignItems={"flex-start"}
        $flexDirection={"column"}
        $mb={28}
        $gap={24}
      >
        <Heading tag="h2" $font={["heading-6", "heading-5"]} $mb={[16, 8]}>
          {props.header}
        </Heading>
        <Box $maxWidth="max-content">
          <Checkbox
            checked={selectAllChecked}
            onChange={handleToggleSelectAll}
            id="select-all"
            name="select-all"
            variant="withLabel"
            labelText="Select all"
            labelFontWeight={600}
          />
        </Box>
      </Flex>
      <FieldError id={"downloads-error"}>{props.errorMessage}</FieldError>
      {props.cardGroup}
    </Box>
  );
};

export default Layout;
