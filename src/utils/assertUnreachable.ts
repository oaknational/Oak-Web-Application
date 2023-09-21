/**
 * For use making sure a switch statement is exhaustive
 *
 * Place in the default block and it will cause a TS type error
 * if you've missed a clause when switching over a union type
 *
 * @example
 *   function doSomething(action: "one" | "two") {
 *     switch (action) {
 *       case "one":
 *         return 1;
 *       default:
 *         // Causes the following error because "two" isn't handled:
 *         //   Argument of type 'string' is not assignable to parameter of type 'never'
 *         assertUnreachable(action)
 *     }
 *   }
 */

export function assertUnreachable(
  _x: never,
  err = new Error("Didn't expect to get here")
): never {
  throw err;
}
