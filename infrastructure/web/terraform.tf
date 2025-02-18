terraform {
  required_providers {
    datadog = {
      source  = "DataDog/datadog"
      version = "~> 3.30.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "6.19.0"
    }
  }
}