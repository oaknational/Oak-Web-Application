import { CompactHeaderProps, Header } from "./Header";

export type UnitHeaderProps = CompactHeaderProps;

const UnitHeader = (props: UnitHeaderProps) => {
  return <Header {...props} layoutVariant="compact" />;
};

export default UnitHeader;
