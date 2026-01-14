locals {
  env_names = [
    {
      gcp                 = "prod",
      vercel              = "production"
      service_account_key = "production"
      is_custom_env       = false

    },
    {
      gcp                 = "staging",
      vercel              = "preview"
      service_account_key = "preview"
      is_custom_env       = false

    },
    {
      gcp                 = "staging",
      vercel              = "staging"
      service_account_key = "preview"
      is_custom_env       = true
    },
  ]
  superuser_workspace_prefix = "gcp-project-superuser"
  required_env_names         = local.build_type == "website" ? local.env_names : []
}

data "terraform_remote_state" "google_projects" {
  for_each = toset([for env_name in local.required_env_names : "${local.superuser_workspace_prefix}-${env_name.gcp}"])

  backend = "remote"
  config = {
    organization = var.terraform_cloud_organisation
    workspaces = {
      name = each.key
    }
  }
}

locals {
  required_env_keys = {
    website = {
      shared  = ["NEXT_PUBLIC_CLERK_SIGN_IN_URL", "NEXT_PUBLIC_CLERK_SIGN_UP_URL"]
      prod    = ["OAK_CONFIG_LOCATION", "OVERRIDE_APP_VERSION", "OVERRIDE_URL", "PUPIL_FIRESTORE_ID"]
      preview = ["OAK_CONFIG_LOCATION", "PUPIL_FIRESTORE_ID"]
    }
    storybook = {
      shared  = ["NEXT_PUBLIC_CLIENT_APP_BASE_URL"]
      prod    = ["OAK_CONFIG_LOCATION", "OVERRIDE_APP_VERSION"]
      preview = ["OAK_CONFIG_LOCATION"]
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
      } if value != null
    ]
  ])

  custom_env_lookup_vars = flatten([
    for env_name in [for env in local.required_env_names : env if env.is_custom_env] : [
      for key, value in {
        "GCP_PROJECT_ID"                         = data.terraform_remote_state.google_projects["${local.superuser_workspace_prefix}-${env_name.gcp}"].outputs.project_id
        "GCP_SERVICE_ACCOUNT_EMAIL"              = data.terraform_remote_state.google_projects["${local.superuser_workspace_prefix}-${env_name.gcp}"].outputs.project_config.workload_identity_service_accounts.vercel["oak-web-application-website::${env_name.service_account_key}"]
        "GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID" = data.terraform_remote_state.google_projects["${local.superuser_workspace_prefix}-${env_name.gcp}"].outputs.workload_identity_provider_names.vercel
        } : {
        key                     = key
        value                   = value
        custom_environment_name = env_name.vercel
        sensitive               = false
      }
    ]
  ])

  all_custom_env_vars = concat(local.custom_env_vars, local.sensitive_custom_env_vars, local.custom_env_vars_shared, local.custom_env_lookup_vars)

  lookup_vars = flatten([
    for env_name in [for env in local.required_env_names : env if !env.is_custom_env] : [
      for key, value in {
        "GCP_PROJECT_ID"                         = data.terraform_remote_state.google_projects["${local.superuser_workspace_prefix}-${env_name.gcp}"].outputs.project_id
        "GCP_SERVICE_ACCOUNT_EMAIL"              = data.terraform_remote_state.google_projects["${local.superuser_workspace_prefix}-${env_name.gcp}"].outputs.project_config.workload_identity_service_accounts.vercel["oak-web-application-website::${env_name.service_account_key}"]
        "GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID" = data.terraform_remote_state.google_projects["${local.superuser_workspace_prefix}-${env_name.gcp}"].outputs.workload_identity_provider_names.vercel
        } : {
        key       = key
        value     = value
        target    = [env_name.vercel]
        sensitive = false
      }
    ]
  ])

  environment_variables = concat(local.non_sensitive_vars, local.sensitive_vars, local.lookup_vars)
}