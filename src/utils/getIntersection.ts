/* gets the intersection of an array of objects
 * @param {Array<Object>} arr - array of objects
 * @returns {Object} - intersection of the objects
 */

export function getIntersection<T>(arr: Array<Partial<T> | null>): Partial<T> {
  return (
    arr.reduce((acc, val) => {
      if (acc === null) {
        return val || {};
      }

      if (!val) {
        return {};
      }

      const o = { ...val };

      for (const key in val) {
        if (acc[key] !== val[key]) {
          delete o[key];
        }
      }
      return o;
    }, null) || {}
  );
}
