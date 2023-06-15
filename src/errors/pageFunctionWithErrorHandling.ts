/**
 * This fucntion is intended to wrap NextJS page functions (e.g. getStaticProps,
 * getServerSideProps, etc.). It takes an async callback function as an argument
 * and it catches any errors thrown during the execution of the callback, and
 * reports them to our error reporting service. It then rethrows the error so
 * that NextJS can handle it.
 *
 */
export const pageFunctionWithErrorHandling = async (
  callback: () => Promise<any>
) => {
  try {
    return await callback();
  } catch (error) {
    // Report error to error reporting service
    reportError(error);
    // Rethrow error so that NextJS can handle it
    throw error;
  }
};
