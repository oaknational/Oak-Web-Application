import sdk from "../../sdk";

import { getCachedTopNavData } from "./cachedTopNav";
import topNavQuery from "./topNav.query";

const appRouterTopNavQuery = topNavQuery(sdk, getCachedTopNavData);

export default appRouterTopNavQuery;
