variable "cloudflare_zone_domain" {
  description = "Domain name for the zone"
  type        = string
}

variable "custom_env_vars" {
  description = "Maps each of custom-environment name to a set of env vars"
  type = object({
    staging = optional(object({
      CURRICULUM_API_2023_URL = string
      OVERRIDE_URL            = string
      OAK_CONFIG_LOCATION     = string
    }))
  })
  default = {}
}

variable "sensitive_custom_env_vars" {
  description = "Maps each of sensitive custom-environment name to a set of env vars"
  type = object({
    staging = optional(object({
      GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT = string
    }))
  })
  sensitive = true
  default   = {}
}

variable "env_vars" {
  type = object({
    shared = optional(object({
      NEXT_PUBLIC_CLERK_SIGN_IN_URL = optional(string)
      NEXT_PUBLIC_CLERK_SIGN_UP_URL = optional(string)
    }))
    prod = optional(object({
      OAK_CONFIG_LOCATION = optional(string)
      OVERRIDE_URL        = optional(string)
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

variable "clerk_secret_key_preview" {
  description = "Clerk secret key for preview environment"
  type        = string
  sensitive   = true
  default     = null

  validation {
    condition = contains(local.required_current_sensitive_env.preview, "CLERK_SECRET_KEY") ? var.clerk_secret_key_preview != null : var.clerk_secret_key_preview == null

    error_message = contains(local.required_current_sensitive_env.preview, "CLERK_SECRET_KEY") ? "Missing clerk_secret_key_preview for '${local.build_type}' build." : "clerk_secret_key_preview is set but not required for '${local.build_type}' build."
  }
}

variable "clerk_secret_key_prod" {
  description = "Clerk secret key for production environment"
  type        = string
  sensitive   = true
  default     = null

  validation {
    condition = contains(local.required_current_sensitive_env.prod, "CLERK_SECRET_KEY") ? var.clerk_secret_key_prod != null : var.clerk_secret_key_prod == null

    error_message = contains(local.required_current_sensitive_env.prod, "CLERK_SECRET_KEY") ? "Missing clerk_secret_key_prod for '${local.build_type}' build." : "clerk_secret_key_prod is set but not required for '${local.build_type}' build."
  }
}

variable "google_secret_manager_service_account_preview" {
  description = "Google Secret Manager service account for preview environment"
  type        = string
  sensitive   = true
  default     = null

  validation {
    condition = contains(local.required_current_sensitive_env.preview, "GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT") ? var.google_secret_manager_service_account_preview != null : var.google_secret_manager_service_account_preview == null

    error_message = contains(local.required_current_sensitive_env.preview, "GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT") ? "Missing google_secret_manager_service_account_preview for '${local.build_type}' build." : "google_secret_manager_service_account_preview is set but not required for '${local.build_type}' build."
  }
}

variable "google_secret_manager_service_account_prod" {
  description = "Google Secret Manager service account for production environment"
  type        = string
  sensitive   = true
  default     = null

  validation {
    condition = contains(local.required_current_sensitive_env.prod, "GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT") ? var.google_secret_manager_service_account_prod != null : var.google_secret_manager_service_account_prod == null

    error_message = contains(local.required_current_sensitive_env.prod, "GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT") ? "Missing google_secret_manager_service_account_prod for '${local.build_type}' build." : "google_secret_manager_service_account_prod is set but not required for '${local.build_type}' build."
  }
}

variable "next_public_clerk_publishable_key_preview" {
  description = "Clerk publishable key for production environment"
  type        = string
  sensitive   = true
  default     = null

  validation {
    condition = contains(local.required_current_sensitive_env.preview, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY") ? var.next_public_clerk_publishable_key_preview != null : var.next_public_clerk_publishable_key_preview == null

    error_message = contains(local.required_current_sensitive_env.preview, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY") ? "Missing next_public_clerk_publishable_key_preview for '${local.build_type}' build." : "next_public_clerk_publishable_key_preview is set but not required for '${local.build_type}' build."
  }
}

variable "next_public_clerk_publishable_key_prod" {
  description = "Clerk publishable key for production environment"
  type        = string
  sensitive   = true
  default     = null

  validation {
    condition = contains(local.required_current_sensitive_env.prod, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY") ? var.next_public_clerk_publishable_key_prod != null : var.next_public_clerk_publishable_key_prod == null

    error_message = contains(local.required_current_sensitive_env.prod, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY") ? "Missing next_public_clerk_publishable_key_prod for '${local.build_type}' build." : "next_public_clerk_publishable_key_prod is set but not required for '${local.build_type}' build."
  }
}