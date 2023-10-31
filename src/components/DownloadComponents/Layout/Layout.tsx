import { FC } from "react";

import { Heading } from "@/components/Typography";
import FieldError from "@/components/FormFields/FieldError";
import Box from "@/components/Box";
import Checkbox from "@/components/Checkbox";
import Flex from "@/components/Flex";

/** Generic layout component for Downloads and Share page */

type LayoutProps = {
  header: string;
  handleToggle: () => void;
  selectAllChecked: boolean;
  errorMessage?: string;
  cardGroup: React.ReactNode;
};

const Layout: FC<LayoutProps> = (props) => {
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
            checked={props.selectAllChecked}
            onChange={props.handleToggle}
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
