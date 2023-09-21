variable "region" {
  type    = string
  default = "europe-west2"
}

variable "env" {
  description = "The name of the environment"
  type        = string
  nullable    = false

  validation {
    # Don't allow production, only prod if you want production....
    condition     = (var.env == "prod" && substr(var.env, 0, 4) == "prod") || substr(var.env, 0, 4) != "prod"
    error_message = "prod is the correct env for production"
  }
}