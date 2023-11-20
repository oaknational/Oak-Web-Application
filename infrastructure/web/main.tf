terraform {
  required_providers {
    datadog = {
      source  = "DataDog/datadog"
      version = "~> 3.30.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "4.50.0"
    }
  }

  cloud {
    organization = "oak-national-academy"
    workspaces {
      tags = ["repo:Oak-Web-Application", "config:web"]
    }
  }
}

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