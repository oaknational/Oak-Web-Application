import { FC } from "react";

import Box from "../../Box";

import Flex from "@/components/Flex/Flex";
import { Heading } from "@/components/Typography";
import Typography from "@/components/Typography/Typography";
import SearchForm from "@/components/SearchForm/SearchForm";
import useSearch from "@/context/Search/useSearch";
import Illustration from "@/components/Illustration/Illustration";

const TeachersTab: FC = () => {
  const { setSearchTerm } = useSearch({});
  return (
    <Flex $background={"mint"}>
      <Flex $flexDirection={"column"}>
        <Heading $font={"heading-7"} tag={"h1"}>
          Teachers
        </Heading>
        <Heading $font={"heading-3"} tag={"h2"}>
          Time-saving teaching resources
        </Heading>
        <Typography $font={"body-1"}>
          Get a head-start on your lesson planning using quality-checked
          resources you can download and adapt for free.
        </Typography>
        <Box $mt={16}>
          <SearchForm
            searchTerm=""
            handleSubmit={(value) => {
              setSearchTerm(value);
            }}
            analyticsSearchSource={"homepage search box"}
          />
        </Box>
      </Flex>
      <Flex>
        <Illustration
          slug={"hero-pupils"}
          noCrop
          $objectFit="contain"
          priority
          // fill
        />
      </Flex>
    </Flex>
  );
};

export default TeachersTab;
