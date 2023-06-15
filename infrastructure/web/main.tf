terraform {
  cloud {
    organization = "oak-national-academy"
    workspaces {
      name = "lesson-videos-${var.environment}"
    }
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.50.0"
    }
  }
}

provider "google" {
  project = var.project
  region  = var.region
}
