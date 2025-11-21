/**
 *
 * The fetch api will not throw an exception in the case that the status
 * code is not 2xx.
 * This utility function checks the response and throws in case of a bad
 * status code.
 */
function handleFetchError(response: Response) {
  if (!response.ok) {
    /**
     * @todo use OakError
     */
    throw new Error(response.statusText);
  }
}

export default handleFetchError;
