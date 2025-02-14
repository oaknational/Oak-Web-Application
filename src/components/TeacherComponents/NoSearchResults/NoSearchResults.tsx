import {
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
} from "@oaknational/oak-components";

interface NoSearchResultsProps {
  searchTerm: string;
}

const NoSearchResults = (props: NoSearchResultsProps) => {
  const { searchTerm } = props;

  return (
    <OakFlex $flexDirection="column">
      <OakHeading
        tag={"h4"}
        $mt="space-between-m"
        $mb="space-between-s"
        $font={"heading-7"}
      >
        No search results
      </OakHeading>
      <OakFlex $flexDirection="column">
        <OakP $font={"body-1"} $mb="space-between-xs">
          Sorry, we could not find any results for{" "}
          <OakSpan $wordWrap={"break-word"}>“{searchTerm}”</OakSpan>.
          <br /> <br /> Please enter a topic you wish to explore in the search
          bar above.
        </OakP>
      </OakFlex>
    </OakFlex>
  );
};

export default NoSearchResults;
