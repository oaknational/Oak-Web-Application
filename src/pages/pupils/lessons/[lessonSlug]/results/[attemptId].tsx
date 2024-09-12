import withFeatureFlag from "@/hocs/withFeatureFlag";

const CanonicalResultsPage = () => {
  return <div>CanonicalResultsPage</div>;
};

const FeaturedCanonicalResultsPage = withFeatureFlag(
  CanonicalResultsPage,
  "share-results-button",
);
export default FeaturedCanonicalResultsPage;
