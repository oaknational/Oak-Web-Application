// I want to create a bucket in gcp to hold lesson videos
resource "google_storage_bucket" "lesson_videos" {
  name          = "lesson-videos-${var.environment}"
  location      = var.region
  force_destroy = var.environment != "production"

  versioning {
    enabled = false
  }

  cors {
    origin          = [var.retool_origin]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["Content-Type", "x-goog-acl"]
    max_age_seconds = 3600
  }
}

resource "google_storage_bucket_iam_member" "lesson_videos_public" {
  bucket = google_storage_bucket.lesson_videos.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}