locals {
  hosts = [
    "www.thenational.academy",
    "owa.thenational.academy"
  ]
  url_string = join(" OR ", [for host in local.hosts : "\\\"https://${host}/\\\""])
}

locals {
  monitors = var.env == "prod" ? [
    {
      name    = "OWA log errors"
      type    = "log alert"
      message = "Errors detected in the OWA logs @slack-Oak_National_Academy-dev-general-alerts"
      query   = "logs(\"source:netlify @http.url:(${local.url_string}) status:error\").index(\"*\").rollup(\"count\")"

      evaluate_period    = "5m"
      warning_threshold  = 0
      critical_threshold = 10
    },
  ] : []
}


locals {
  monitor_records = {
    for m in local.monitors : m.name => m
  }
}

resource "datadog_monitor" "this" {
  for_each = local.monitor_records

  name    = "${title(var.env)} ${each.value.name}"
  type    = each.value.type
  message = each.value.message

  query = "${each.value.query}.last(\"${each.value.evaluate_period}\") > ${each.value.critical_threshold}"

  monitor_thresholds {
    warning  = each.value.warning_threshold
    critical = each.value.critical_threshold
  }

  tags = [
    "env:${var.env}",
    "terraform:true",
    "repo:Oak-Web-Application",
    "config:web"
  ]
}