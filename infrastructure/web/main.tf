terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.50.0"
    }
  }
}

# Uses GOOGLE_CREDENTIALS environment variable
provider "google" {
  project = var.project
  region  = var.region
}