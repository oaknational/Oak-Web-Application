locals {
  required_env_keys = {
    website = {
      shared  = ["NEXT_PUBLIC_CLERK_SIGN_IN_URL", "NEXT_PUBLIC_CLERK_SIGN_UP_URL"]
      prod    = ["OAK_CONFIG_LOCATION"]
      preview = ["OAK_CONFIG_LOCATION"]
    }
    storybook = {
      shared  = []
      prod    = ["OAK_CONFIG_LOCATION"]
      preview = ["OAK_CONFIG_LOCATION", "NEXT_PUBLIC_CLIENT_APP_BASE_URL"]
    }
  }

  required_sensitive_env_keys = {
    website = {
      shared  = []
      prod    = ["CLERK_SECRET_KEY", "GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"]
      preview = ["CLERK_SECRET_KEY", "GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"]
    }
    storybook = {
      shared  = []
      prod    = ["GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT"]
      preview = ["GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT"]
    }
  }

  required_current_env           = local.required_env_keys[local.build_type]
  required_current_sensitive_env = local.required_sensitive_env_keys[local.build_type]

  env_groups = {
    shared  = ["production", "preview"]
    prod    = ["production"]
    preview = ["preview"]
  }

  non_sensitive_vars = flatten([
    for group, target in local.env_groups : [
      for key, value in var.env_vars[group] : {
        key       = key
        value     = value
        target    = target
        sensitive = false
      }
    ]
  ])

  sensitive_vars = flatten([
    for group, target in local.env_groups : [
      for key, value in var.sensitive_env_vars[group] : {
        key       = key
        value     = value
        target    = target
        sensitive = true
      }
    ]
  ])

  environment_variables = concat(local.non_sensitive_vars, local.sensitive_vars)
}
