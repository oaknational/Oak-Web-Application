import { FC } from "react";
import Link from "next/link";

import SearchForm from "../SearchForm";
import Flex from "../Flex";
import FixedHeader from "../FixedHeader";
import Logo from "../Logo";

/**
 * Header for logging in and using search -
 * header for the app, not a landing page
 *
 */
const AppHeader: FC = () => {
  return (
    <FixedHeader $background="grey3">
      <Flex $mr={40} $justifyContent={"space-between"}>
        <Link href={"/"} passHref>
          <Link href={"/"}>
            <a>
              <Logo title={"Oak National Academy"} height={48} width={104} />
            </a>
          </Link>
        </Link>
        <SearchForm />
      </Flex>
    </FixedHeader>
  );
};

export default AppHeader;
