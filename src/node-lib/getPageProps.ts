import { ParsedUrlQuery } from "querystring";

import { GetStaticPropsContext, GetStaticPropsResult, PreviewData } from "next";

import errorReporter, { initialiseBugsnag } from "../common-lib/error-reporter";
import OakError from "../errors/OakError";

import { decorateWithIsr } from "./isr";

initialiseBugsnag(null);

/**
 * This function is intended to wrap NextJS page functions (e.g. getStaticProps,
 * getServerSideProps, etc.).It takes an async getProps() function as an argument
 * and it catches any errors thrown during the execution of the getProps(), and
 * reports them to our error reporting service. It then rethrows the error so
 * that NextJS can handle it.
 * Before returning results, it decorates the object with ISR props.
 */
const getPageProps = async <PageProps>({
  page,
  context,
  withIsr = true,
  getProps,
}: {
  /**
   * The name of the page. This is used to identify the page in the error
   * reporting service.
   */
  page: string;
  /**
   * The context object passed to the page function. This context is passed to
   * the error reporting service.
   */
  context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>;
  /**
   * Whether to decorate the props with ISR. Defaults to true.
   */
  withIsr?: boolean;
  /**
   * The page function to wrap
   */
  getProps: () => Promise<GetStaticPropsResult<PageProps>>;
}): Promise<GetStaticPropsResult<PageProps>> => {
  try {
    /**
     * Fetch props
     */
    const results = await getProps();
    /**
     * Add incremental static regeneration props if enabled
     */
    return withIsr ? decorateWithIsr(results) : results;
  } catch (error) {
    /**
     * If error suggests status code should be 404, return notFound
     */
    if (error instanceof OakError) {
      if (error.config.responseStatusCode === 404) {
        return {
          notFound: true,
        };
      }
    }
    /**
     * Report error to error reporting service
     */
    await errorReporter(page)(error, { ...context });
    /**
     * Rethrow error so that NextJS can handle it
     */
    throw error;
  }
};

export default getPageProps;
