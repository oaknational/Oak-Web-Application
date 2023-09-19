terraform {
  required_providers {
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

data "terraform_remote_state" "google_cloud" {
  backend = "remote"
  config = {
    organization = "oak-national-academy"
    workspaces = {
      name = "google-cloud-core"
    }
  }
}

provider "google" {
  // Currently we use the same project for all environments
  project = data.terraform_remote_state.google_cloud.outputs.projects["prod"]
  region  = var.region
}
