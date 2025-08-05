locals {
  builds = {
    website = {
      description     = "Oak Web Application Website"
      domains         = ["owa.thenational.academy", "www.thenational.academy"]
      build_type      = "website"
      deployment_type = "standard_protection"
      framework       = "nextjs"
      skew_protection = "7 days"

      custom_environments = [
        {
          name   = "staging"
          domain = "owa-staging.thenational.academy"
        }
      ]
    },
    storybook = {
      description      = "Oak Web Application Storybook"
      domains          = ["storybook.thenational.academy"]
      build_command    = "npm run storybook:build"
      build_type       = "storybook"
      deployment_type  = "all_deployments"
      framework        = "storybook"
      output_directory = "storybook-static"
      skew_protection  = "1 day"
    }
  }
}