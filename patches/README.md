# OakSelect compatibility patch

The Oak Components 3.9.0 patch backports [the upstream hydration fix](https://github.com/oaknational/oak-components/commit/1d73f2951f8aa7ca157da05de09e994949fc2b52). It removes the unused `button` and `selectedcontent` children of the native select from both published JavaScript builds; styling and options are unchanged.

Remove the patch when upgrading to a library release containing that fix.
