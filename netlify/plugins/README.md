# Custom Netlify Plugins

We have two custom Netlify build plugins, one for reporting builds into GitHub, and one for reporting builds into Slack.

They can be disabled (e.g. for temporary custom builds in new Netlify projects) by setting the env variables `PLUGIN_GITHUB_DEPLOYMENTS_DISABLED=true` or `PLUGIN_SLACK_DISABLED=true`.