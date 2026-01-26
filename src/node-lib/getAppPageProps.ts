import { notFound } from "next/navigation";

import errorReporter, {
  initialiseBugsnag,
  initialiseSentry,
} from "../common-lib/error-reporter";
import OakError from "../errors/OakError";

import { AppRoutes } from ".next/types/routes";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";


if (getBrowserConfig("sentryEnabled") === "true") {
  initialiseSentry(null);
} else {
  initialiseBugsnag(null);
}

/**
 * This function is intended to wrap NextJS page functions (e.g. getStaticProps,
 * getServerSideProps, etc.).It takes an async getProps() function as an argument
 * and it catches any errors thrown during the execution of the getProps(), and
 * reports them to our error reporting service. It then rethrows the error so
 * that NextJS can handle it.
 * Before returning results, it decorates the object with ISR props.
 */
const getAppPageProps = async <T extends AppRoutes>({
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
  props: PageProps<T>;
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
