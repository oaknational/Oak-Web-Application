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
  userDetails: React.ReactNode;
  ctaButton: React.ReactNode;
};

const Layout: FC<LayoutProps> = (props) => {
  return (
    <Box $width="100%">
      <Flex $alignItems={"flex-start"} $flexDirection={"column"} $gap={32}>
        <Heading tag="h1" $font={["heading-5", "heading-4"]}>
          {props.header}
        </Heading>
        <Flex $justifyContent="space-between" $width="100%">
          <Flex $flexDirection="column" $gap={24}>
            <Heading tag="h3" $font={["heading-6", "heading-5"]}>
              Lesson Resources
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
            <FieldError id={"downloads-error"}>{props.errorMessage}</FieldError>
            {props.cardGroup}
          </Flex>
          <Flex $flexDirection="column">
            {props.userDetails}
            {props.ctaButton}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Layout;
