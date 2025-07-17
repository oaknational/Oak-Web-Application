locals {
  workspace_prefix = "owa-project-"

  build_type = replace(terraform.workspace, local.workspace_prefix, "")

  build_config = local.builds[local.build_type]

}

resource "terraform_data" "workspace_validation" {
  lifecycle {
    precondition {
      condition     = startswith(terraform.workspace, local.workspace_prefix)
      error_message = "Workspace name \"${terraform.workspace}\" must begin with ${local.workspace_prefix}"
    }
  }
}

module "vercel" {
  source                 = "github.com/oaknational/oak-terraform-modules//modules/vercel_project?ref=v1.2.3"
  build_command          = try(local.build_config.build_command, null)
  build_type             = local.build_config.build_type
  cloudflare_zone_domain = var.cloudflare_zone_domain
  domains                = local.build_config.domains
  framework              = local.build_config.framework
  git_branch             = try(local.build_config.git_branch, null)
  ignore_command         = try(local.build_config.ignore_command, null)
  output_directory       = try(local.build_config.output_directory, null)
  deployment_type        = local.build_config.deployment_type
  git_repo               = "oaknational/Oak-Web-Application"
  skew_protection        = local.build_config.skew_protection

  environment_variables = [
    for ev in local.environment_variables : ev
    if ev.value != null && ev.value != ""
  ]
}