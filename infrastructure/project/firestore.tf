
locals {
  firestore_envs = local.build_type == "website" ? [
    for env_name in local.required_env_names : env_name
    if !env_name.is_custom_env
  ] : []
}

module "firestore" {
  source = "github.com/oaknational/oak-terraform-modules//modules/gcp_firestore?ref=v2.0.4"

  for_each = {
    for env in local.firestore_envs : env.gcp => env
  }

  project_id = data.terraform_remote_state.google_projects[
    "${local.superuser_workspace_prefix}-${each.value.gcp}"
  ].outputs.project_id

  name_parts = {
    domain   = "ow"
    app      = "pupil"
    resource = "store"
  }

  env = each.value.gcp == "prod" ? "prod" : "preview"

  backup = each.value.gcp == "prod" && var.firestore.firestore_weekly_backup_retention != 0 ? {
    frequency     = "w"
    retention     = var.firestore.firestore_weekly_backup_retention
    day           = 0
    point_in_time = var.firestore.firestore_enable_point_in_time_recovery
    } : {
    frequency = "n"
  }

  indexes = [
    {
      collection = "pupilLessonAttempts"
      fields = [
        {
          path = "createdAt"
        },
        {
          path = "attemptId"
        },
      ]
    },
    {
      collection = "teacherNotes"
      fields = [
        {
          path = "createdAt"
        },
        {
          path = "noteId"
        },
      ]
    }

  ]

  use_optimistic_concurrency = true
}
