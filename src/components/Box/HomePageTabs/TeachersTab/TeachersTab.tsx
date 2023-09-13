import { FC } from "react";

import Box from "../../Box";

import Flex from "@/components/Flex/Flex";
import { Heading } from "@/components/Typography";
import Typography from "@/components/Typography/Typography";
import SearchForm from "@/components/SearchForm/SearchForm";
import useSearch from "@/context/Search/useSearch";
import Illustration from "@/components/Illustration/Illustration";
import MaxWidth from "@/components/MaxWidth/MaxWidth";

const TeachersTab: FC = () => {
  const { setSearchTerm } = useSearch({});
  return (
    <Flex $background={"mint"} $ph={24}>
      <MaxWidth>
        <Flex $flexDirection={"row"} $justifyContent={"space-between"}>
          <Flex
            $flexDirection={"column"}
            $maxWidth={640}
            $pt={32}
            $alignItems={"flex-start"}
            $gap={24}
            $flex={"1 0 0"}
          >
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
          <Flex
            $pv={64}
            $flexDirection={"column"}
            $justifyContent={"space-between"}
            $alignItems={"flex-start"}
            $flexShrink={0}
          >
            <Illustration
              slug={"hero-pupils"}
              noCrop
              $objectFit="contain"
              priority
              $ba={3}
              $borderStyle={"solid"}
              $borderColor={"black"}
            />
          </Flex>
        </Flex>
      </MaxWidth>
    </Flex>
  );
};

export default TeachersTab;
