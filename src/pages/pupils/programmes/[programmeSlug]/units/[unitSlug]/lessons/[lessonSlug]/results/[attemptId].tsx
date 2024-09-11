import withFeatureFlag from "@/hocs/withFeatureFlag";

const ResultsPage = () => {
  return <div>ResultsPage</div>;
};

const FeaturedResultsPage = withFeatureFlag(
  ResultsPage,
  "share-results-button",
);
export default FeaturedResultsPage;
