import { notFound } from "next/navigation";

import errorReporter, {
  initialiseBugsnag,
  initialiseSentry,
} from "../common-lib/error-reporter";
import OakError from "../errors/OakError";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";

if (getBrowserConfig("sentryEnabled") === "true") {
  initialiseSentry(null);
} else {
  initialiseBugsnag(null);
}

type PageParams = Record<string, string>;
export type AppPageProps<T extends PageParams> = {
  params: Promise<T>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * This function is intended to wrap NextJS app page.tsx functions.
 * It takes an async getProps() function as an argument which should return a page component
 * and it catches any errors thrown during the execution of the getProps(), and
 * reports them to our error reporting service. It then rethrows the error so
 * that NextJS can handle it.
 */
const getAppPageProps = async <T extends PageParams>({
  page,
  props,
  getProps,
}: {
  /**
   * The name of the page. This is used to identify the page in the error
   * reporting service.
   */
  page: string;
  /**
   * The props passed to the page function. This is passed to
   * the error reporting service.
   */
  props: AppPageProps<T>;
  /**
   * The page function to wrap
   */
  getProps: () => Promise<React.JSX.Element | undefined>;
}): Promise<React.JSX.Element | undefined> => {
  try {
    const results = await getProps();
    return results;
  } catch (error) {
    if (error instanceof OakError) {
      if (error.config.responseStatusCode === 404) {
        return notFound();
      }
    }

    /**
     * Report error to error reporting service
     */
    await errorReporter(page)(error, { ...props });
    /**
     * Rethrow error so that NextJS can handle it
     */
    throw error;
  }
};

export default getAppPageProps;
