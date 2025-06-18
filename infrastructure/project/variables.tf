variable "env_vars" {
  type = object({
    shared = object({
      NEXT_PUBLIC_CLERK_SIGN_IN_URL = string
      NEXT_PUBLIC_CLERK_SIGN_UP_URL = string
    })
    prod = object({
      OAK_CONFIG_LOCATION = string
    })
    preview = object({
      OAK_CONFIG_LOCATION = string
    })
  })
}

variable "sensitive_env_vars" {
  type = object({
    shared = object({})
    prod = object({
      CLERK_SECRET_KEY                      = string
      GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT = string
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY     = string
    })
    preview = object({
      CLERK_SECRET_KEY                      = string
      GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT = string
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY     = string
    })
  })
  sensitive = true
}