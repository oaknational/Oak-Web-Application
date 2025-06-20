locals {
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
