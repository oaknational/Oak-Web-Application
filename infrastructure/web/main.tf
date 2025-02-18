locals {
  project_workspace_prefix = "gcp-project-superuser-"
  project_env              = "prod" // For now all OWA resources are in the same project
}

data "terraform_remote_state" "google_project" {
  backend = "remote"
  config = {
    organization = "oak-national-academy"
    workspaces = {
      name = "${local.project_workspace_prefix}${local.project_env}"
    }
  }
}

provider "datadog" {
  api_url = "https://api.datadoghq.eu/"
}

provider "google" {
  project = data.terraform_remote_state.google_project.outputs.project_id
  region  = var.region
}