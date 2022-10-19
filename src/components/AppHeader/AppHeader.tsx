import { FC } from "react";

import SearchForm from "../SearchForm";
import Flex from "../Flex";
import FixedHeader from "../FixedHeader";
import Logo from "../Logo";
import { HeaderProps } from "../Layout/Layout";
import OakLink from "../OakLink";

/**
 * Header for logging in and using search -
 * header for the app, not a landing page
 *
 */
const AppHeader: FC<HeaderProps> = () => {
  return (
    <FixedHeader $background="grey3">
      <Flex $mr={40} $justifyContent={"space-between"}>
        <OakLink page={"home"}>
          <Logo title={"Oak National Academy"} height={48} width={104} />
        </OakLink>
        <SearchForm />
      </Flex>
    </FixedHeader>
  );
};

export default AppHeader;
