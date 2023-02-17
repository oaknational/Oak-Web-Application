import Flex from "../Flex";
import { Heading, P } from "../Typography";

interface NoSearchResultsProps {
  searchTerm: string;
}

const NoSearchResults = (props: NoSearchResultsProps) => {
  const { searchTerm } = props;

  return (
    <Flex $flexDirection="column" $pl={24}>
      <Heading tag={"h4"} $mt={24} $mb={16} $font={"heading-7"}>
        No search results
      </Heading>
      <Flex $flexDirection="column">
        <P $font={"body-1"} $mb={12}>
          Sorry, we could not find any results for "{searchTerm}".
          <br /> <br /> Please enter a topic you wish to explore in the search
          bar above.
        </P>
      </Flex>
    </Flex>
  );
};

export default NoSearchResults;
