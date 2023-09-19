locals {
  bucket_name_suffix = var.env == "prod" ? "production" : (var.env == "beta" ? "staging" : var.env)
}

resource "google_storage_bucket" "lesson_videos" {
  name          = "lesson-videos-${local.bucket_name_suffix}"
  location      = var.region
  force_destroy = var.env != "prod"

  versioning {
    enabled = false
  }

  cors {
    origin          = [var.retool_origin]
    method          = ["GET", "HEAD", "PUT", "POST"]
    response_header = ["Content-Type", "x-goog-acl"]
    max_age_seconds = 3600
  }
}


