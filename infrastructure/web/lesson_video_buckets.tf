
resource "google_storage_bucket" "lesson_videos" {
  name          = "lesson-videos-${var.environment}"
  location      = var.region
  force_destroy = var.environment != "production"

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


