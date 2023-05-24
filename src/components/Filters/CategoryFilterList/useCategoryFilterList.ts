import { useEffect, useState } from "react";

import { CategoryLinkProps } from "./CategoryFilterListItem";

const useCategoryFilterList = <T extends CategoryLinkProps>(props: {
  selectedKey?: string | null;
  getKey: (linkProps: T) => string | undefined | null;
}) => {
  const { selectedKey, getKey } = props;
  console.log("selectedKey", selectedKey, "getKey", getKey);
  const [visiblySelected, setVisiblySelected] = useState(selectedKey);

  useEffect(() => {
    setVisiblySelected(selectedKey);
  }, [selectedKey]);

  return {
    getIsSelected: (linkProps: T) => visiblySelected === getKey(linkProps),
    setSelected: (linkProps: T) => setVisiblySelected(getKey(linkProps)),
  };
};

export default useCategoryFilterList;
