locals {
  workspace_prefix = "owa-project-"
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
  source                = "github.com/oaknational/oak-terraform-modules//modules/vercel_project?ref=v1.2.0"
  build_type            = "website"
  cloudflare_zone_domain= var.cloudflare_zone_domain
  environment_variables = local.environment_variables
  ignore_command        = "if [ \"$VERCEL_GIT_COMMIT_REF\" = \"feat/eng-1145-vercel-migration\" ]; then exit 1; else exit 0; fi"
  deployment_type       = "all_deployments"
  git_repo              = "oaknational/Oak-Web-Application"
  skew_protection       = "7 days"

  domains = ["owa-vercel.thenational.academy"]
}