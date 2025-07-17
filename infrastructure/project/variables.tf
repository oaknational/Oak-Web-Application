variable "cloudflare_zone_domain" {
  description = "Domain name for the zone"
  type        = string
}

variable "custom_env_vars" {
  description = "Maps each of custom-environment name to a set of env vars"
  type = object({
    staging = optional(object({
      CURRICULUM_API_2023_URL = string
    }))
  })
  default = {}
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
  validation {
    condition = alltrue([
      for gk, gv in local.required_current_env : alltrue([
        toset(keys({ for k, v in var.env_vars[gk] : k => v if v != null && v != "" })) == toset(gv)
      ])
    ])
    error_message = "Environment variables don't match requirements for '${local.build_type}' build. Required: ${jsonencode(local.required_current_env)}"
  }
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

  validation {
    condition = alltrue([
      for gk, gv in local.required_current_sensitive_env : alltrue([
        toset(keys({ for k, v in var.sensitive_env_vars[gk] : k => v if v != null })) == toset(gv)
      ])
    ])
    error_message = "Sensitive environment variables don't match requirements for '${local.build_type}' build. Required: ${jsonencode(local.required_current_sensitive_env)}"
  }
}