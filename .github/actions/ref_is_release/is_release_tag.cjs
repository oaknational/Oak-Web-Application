/**
 * Determine is a ref is a release tag.
 *
 * @param {string} ref A git ref, refs/heads/some_feature or refs/tags/some_tag
 * @returns {boolean}
 */
module.exports = function isReleaseTag(ref) {
  return /^refs\/tags\/v\d+.\d+.\d+$/.test(ref);
};
