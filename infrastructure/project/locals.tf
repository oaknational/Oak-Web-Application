locals {
  required_env_keys = {
    website = {
      shared  = ["NEXT_PUBLIC_CLERK_SIGN_IN_URL", "NEXT_PUBLIC_CLERK_SIGN_UP_URL"]
      prod    = ["OAK_CONFIG_LOCATION", "OVERRIDE_URL"]
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

  sensitive_env_vars = {
    shared = {}
    prod = {
      CLERK_SECRET_KEY                      = var.clerk_secret_key_prod
      GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT = var.google_secret_manager_service_account_prod
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY     = var.next_public_clerk_publishable_key_prod
    }
    preview = {
      CLERK_SECRET_KEY                      = var.clerk_secret_key_preview
      GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT = var.google_secret_manager_service_account_preview
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY     = var.next_public_clerk_publishable_key_preview
    }
  }

  sensitive_vars = flatten([
    for group, target in local.env_groups : [
      for key, value in local.sensitive_env_vars[group] : {
        key       = key
        value     = value
        target    = target
        sensitive = true
      } if value != null
    ]
  ])

  custom_env_names = [for ce in try(local.build_config.custom_environments, []) : ce.name]

  custom_env_vars = flatten([
    for env_name, env_map in var.custom_env_vars : ([
      contains(local.custom_env_names, env_name) ? [
        for key, value in env_map : {
          custom_environment_name = env_name
          key                     = key
          value                   = value
        }
      ]
      : []
    ])
  ])

  sensitive_custom_env_vars = flatten([
    for env_name, env_map in var.sensitive_custom_env_vars : ([
      contains(local.custom_env_names, env_name) ? [
        for key, value in env_map : {
          custom_environment_name = env_name
          key                     = key
          value                   = value
          sensitive               = true
        }
      ]
      : []
    ])
  ])

  custom_env_vars_shared = flatten([
    for env in local.custom_env_names :
    [
      for key, value in var.env_vars.shared : {
        key                     = key
        value                   = value
        custom_environment_name = env
      }
    ]
  ])

  all_custom_env_vars = concat(local.custom_env_vars, local.sensitive_custom_env_vars, local.custom_env_vars_shared)

  environment_variables = concat(local.non_sensitive_vars, local.sensitive_vars)
}
