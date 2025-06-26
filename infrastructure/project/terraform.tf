terraform {

  required_version = ">= 1.5.7"

  cloud {
    organization = "oak-national-academy"
    workspaces {
      tags = ["repo:Oak-Web-Application", "config:project"]
    }
  }
}