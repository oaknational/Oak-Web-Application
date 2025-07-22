locals {
  builds = {
    website = {
      description     = "Oak Web Application Website"
      domains         = ["owa-vercel.thenational.academy"]
      build_type      = "website"
      deployment_type = "standard_protection"
      framework       = "nextjs"
      ignore_command  = "if [ \"$VERCEL_GIT_COMMIT_REF\" = \"feat/eng-1145-vercel-migration\" ]; then exit 1; else exit 0; fi"
      skew_protection = "7 days"

      custom_environments = [
        {
          name   = "staging"
          domain = "staging.thenational.academy"
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
      git_branch       = "feat/eng-1145-vercel-migration"
      ignore_command   = "if [ \"$VERCEL_GIT_COMMIT_REF\" = \"feat/eng-1145-vercel-migration\" ]; then exit 1; else exit 0; fi"
      output_directory = "storybook-static"
      skew_protection  = "1 day"
    }
  }
}