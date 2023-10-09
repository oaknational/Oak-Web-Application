locals {
  hosts = [
    "www.thenational.academy",
    "owa.thenational.academy"
  ]
  evaluate_period    = "5m"
  warning_threshold  = 0
  critical_threshold = 10
}

locals {
  url_string = join(" OR ", [for host in local.hosts : "\\\"https://${host}/\\\""])
}

resource "datadog_monitor" "log_errors" {
  count = var.env == "prod" ? 1 : 0

  name    = "${title(var.env)} OWA log errors"
  type    = "log alert"
  message = "Errors detected in the OWA logs @slack-Oak_National_Academy-dev-general-alerts"

  query = "logs(\"source:netlify @http.url:(${local.url_string}) status:error\").index(\"*\").rollup(\"count\").last(\"${local.evaluate_period}\") > ${local.critical_threshold}"

  monitor_thresholds {
    warning  = local.warning_threshold
    critical = local.critical_threshold
  }

  tags = [
    "env:${var.env}",
    "terraform:true",
    "repo:Oak-Web-Application",
    "config:web"
  ]
}
