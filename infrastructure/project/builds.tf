locals {
  builds = {
    website = {
      description     = "Oak Web Application Website"
      domains         = ["owa-vercel.thenational.academy"]
      build_type      = "website"
      framework       = "nextjs"
      ignore_command  = "if [ \"$VERCEL_GIT_COMMIT_REF\" = \"feat/eng-1145-vercel-migration\" ]; then exit 1; else exit 0; fi"
      skew_protection = "7 days"
    },
    storybook = {
      description      = "Oak Web Application Storybook"
      domains          = ["storybook-vercel.thenational.academy"]
      build_command    = "npm run storybook:build"
      build_type       = "storybook"
      framework        = "storybook"
      output_directory = "storybook-static"
      skew_protection  = "1 day"
    }
  }
}