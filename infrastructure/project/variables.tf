variable "cloudflare_zone_domain" {
  description = "Domain name for the zone"
  type        = string
}

variable "env_vars" {
  type = object({
    shared = optional(object({
      NEXT_PUBLIC_CLERK_SIGN_IN_URL = optional(string)
      NEXT_PUBLIC_CLERK_SIGN_UP_URL = optional(string)
    }))
    prod = optional(object({
      OAK_CONFIG_LOCATION = optional(string)
    }))
    preview = optional(object({
      OAK_CONFIG_LOCATION             = optional(string)
      NEXT_PUBLIC_CLIENT_APP_BASE_URL = optional(string)
    }))
  })
}

variable "sensitive_env_vars" {
  type = object({
    shared = optional(object({}))
    prod = optional(object({
      CLERK_SECRET_KEY                      = optional(string)
      GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT = optional(string)
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY     = optional(string)
    }))
    preview = optional(object({
      CLERK_SECRET_KEY                      = optional(string)
      GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT = optional(string)
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY     = optional(string)
    }))
  })
  sensitive = true
}