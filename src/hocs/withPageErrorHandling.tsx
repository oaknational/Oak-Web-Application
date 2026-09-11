import { notFound, unstable_rethrow } from "next/navigation";

import errorReporter, {
  initialiseBugsnag,
  initialiseSentry,
} from "../common-lib/error-reporter";
import OakError from "../errors/OakError";
import type { PageSearchParms } from "../app/(core)/teachers/programmes/[slug]/[tab]/page";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";

if (getBrowserConfig("sentryEnabled") === "true") {
  initialiseSentry(null);
} else {
  initialiseBugsnag(null);
}

type PageParams = Record<string, string>;
export type AppPageProps<T extends PageParams> = {
  params: Promise<T>;
  searchParams?: Promise<PageSearchParms>;
};

/**
 * This function is intended to wrap NextJS app page.tsx functions and add error handling.
 * It wraps an async component and it catches any errors thrown during the execution of the page fn,
 * and reports them to our error reporting service. It then rethrows the error so
 * that NextJS can handle it.
 */

function withPageErrorHandling<T extends PageParams>(
  AsyncComponent: (props: AppPageProps<T>) => Promise<React.ReactNode>,
  /**
   * The name of the page. This is used to identify the page in the error
   * reporting service.
   */
  page: string,
) {
  return async function WrappedAsyncComponent(props: AppPageProps<T>) {
    try {
      return await AsyncComponent(props);
    } catch (error) {
      if (error instanceof OakError) {
        if (error.config.responseStatusCode === 404) {
          return notFound();
        }
      }

      // Rethrow Next.js internal control-flow signals (redirect, notFound, forbidden,
      // dynamic API bailouts, PPR postpone, etc.) untouched before doing any async work,
      // otherwise Next.js can't detect them and the build fails instead of handling them.
      unstable_rethrow(error);

      const { params } = props;
      await errorReporter(page)(error, {
        ...(await params),
      });

      /**
       * Rethrow error so that NextJS can handle it
       */
      throw error;
    }
  };
}

export default withPageErrorHandling;
