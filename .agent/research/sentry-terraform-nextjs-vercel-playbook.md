
# Sentry + Terraform/TF Cloud + Next.js 15 on Vercel — Canonical Playbook
**Date:** 2025-11-14

This guide gives you a **repeatable, disaster‑recovery‑friendly** way to manage Sentry with **Terraform & Terraform Cloud (TFC)**, and to integrate Sentry into a **TypeScript + Next.js 15** app deployed on **Vercel**. It’s opinionated and production‑oriented for teams releasing often with GitHub → Vercel CI/CD.

> **What you’ll get**
>
> * A Terraform layout that creates Sentry teams, projects, alerts, data filters and exposes **DSNs** as outputs.
> * TFC variable‑set patterns to keep secrets out of state.
> * A Next.js 15 setup (client/server/edge) with source maps, releases, tracing, profiling & replay.
> * Vercel wiring for sourcemap upload and per‑environment DSNs.
>
> Everything below is safe to paste into a new repo and adapt.

---

## 0) High‑level architecture

```
GitHub (infra repo) ──► Terraform Cloud (VCS-driven) ──► Sentry (org, teams, projects, alerts)
                                       ▲
                                       │ variable sets (tokens, slugs)
                                       │
GitHub (app repo) ──► Vercel (builds) ─┴─► Next.js 15 app
                                              ├─ @sentry/nextjs SDK (client/server/edge)
                                              ├─ withSentryConfig (sourcemaps)
                                              └─ Releases, tracing, profiling, replay
```

---

## 1) Terraform + Terraform Cloud (TFC)

### 1.1 Provider and remote backend

*Use the Sentry provider `jianyuan/sentry`, which is the community provider **officially sponsored by Sentry**.*

```hcl
terraform {
  required_version = ">= 1.6.0"

  required_providers {
    sentry = {
      source  = "jianyuan/sentry"
      version = "~> 0.14.6"
    }
  }

  cloud {
    organization = "YOUR_TFC_ORG"
    workspaces { name = "sentry-infra" }
  }
}

# Prefer sourcing the token from TFC env vars (SENTRY_AUTH_TOKEN)
provider "sentry" {}
```

> **TFC variables:** Put `SENTRY_AUTH_TOKEN` (sensitive), and optionally `SENTRY_BASE_URL` (for self-hosted) in a **Variable Set** that you can attach to the `sentry-infra` workspace. Use **Environment** variables in TFC, marked **Sensitive**. This avoids secrets in code and lets you re-use across workspaces.

### 1.2 Organization, team, project, DSN output

Create a team, a Next.js project, and fetch the public DSN as a Terraform output.

```hcl
variable "sentry_org_slug" {
  description = "Your Sentry organization slug"
  type        = string
}

variable "project_slug" {
  description = "Slug for the Sentry project (e.g., web-app)"
  type        = string
}

variable "team_slug" {
  description = "Sentry team slug to own the project"
  type        = string
}

resource "sentry_team" "team" {
  organization = var.sentry_org_slug
  name         = "Web Team"
  slug         = var.team_slug
}

resource "sentry_project" "web" {
  organization = var.sentry_org_slug
  slug         = var.project_slug
  name         = "Web App"
  teams        = [sentry_team.team.slug]

  # For Next.js, 'javascript' platform is appropriate.
  platform     = "javascript"

  # Optional: turn off default issue alert, we’ll define our own
  default_rules = false
}

# Grab the client key (DSN)
data "sentry_key" "default" {
  project_id = sentry_project.web.id
}

output "dsn_public" {
  value       = data.sentry_key.default.dsn["public"]
  description = "Public DSN for the app (NEXT_PUBLIC_SENTRY_DSN)"
}
```

> **Note:** Sentry **environments** (e.g., `production`, `preview`) are created when events arrive. If you want to reference environments in alerts **before any events exist**, see §1.4 for a small helper provider.

### 1.3 Alerts you’ll likely want

**Issue Alert** (noise‑controlled “new issue/regression” email to team) and **Metric Alert** (performance threshold, Slack).

```hcl
# ISSUE ALERT: notify team on new issue affecting many users
resource "sentry_issue_alert" "new_issue_many_users" {
  organization = var.sentry_org_slug
  project      = sentry_project.web.id
  name         = "New issue affecting many users"

  # v2-style schema
  conditions_v2 = [
    {
      id   = "sentry.rules.conditions.first_seen_event.FirstSeenEventCondition"
      name = "A new issue is seen"
    },
    {
      id        = "sentry.rules.conditions.event_frequency.EventFrequencyCondition"
      comparison = "gt"
      interval   = "1h"
      value      = 50
      name       = "Issue affects more than 50 events in 1h"
    }
  ]

  filters_v2 = [
    {
      id     = "sentry.rules.filters.assigned_to.AssignedToFilter"
      target = "none"
      name   = "Issue is unassigned"
    }
  ]

  actions_v2 = [
    {
      id              = "sentry.mail.actions.NotifyEmailAction"
      targetType      = "Team"
      targetIdentifier = "team:"
    }
  ]

  # Scope to environments once they exist, e.g. ["production"]
  environment = null
}

# METRIC ALERT: p95 transaction duration above 1500ms for 5 minutes -> Slack
# (requires Slack integration in Sentry org)
data "sentry_organization_integration" "slack" {
  organization = var.sentry_org_slug
  provider_key = "slack"
  name         = "YOUR_SLACK_WORKSPACE_NAME"
}

resource "sentry_metric_alert" "slow_p95" {
  organization = var.sentry_org_slug
  project      = sentry_project.web.id
  name         = "p95 > 1500ms"
  dataset      = "transactions"
  query        = "" # scope further if desired, e.g., 'event.type:transaction transaction:/checkout'
  aggregate    = "p95(transaction.duration)"
  time_window  = 5    # minutes
  threshold_type = 0  # above
  resolve_threshold = 1200

  trigger {
    label           = "critical"
    alert_threshold = 1500

    action {
      type              = "slack"
      target_type       = "specific"
      target_identifier = "#alerts-web"
      integration_id    = data.sentry_organization_integration.slack.id
    }
  }
}
```

### 1.4 (Optional) Pre‑create environments so environment‑scoped alerts work on day one

If you need alerts scoped to `production` or `preview` **before events have been ingested**, you can use the tiny `ALX-TH/sentryenv` provider to create environments up front:

```hcl
terraform {
  required_providers {
    sentryenv = {
      source  = "ALX-TH/sentryenv"
      version = "~> 0.1"
    }
  }
}

provider "sentryenv" {}

resource "sentryenv_environment" "prod" {
  organization = var.sentry_org_slug
  project      = sentry_project.web.slug
  name         = "production"
}

resource "sentryenv_environment" "preview" {
  organization = var.sentry_org_slug
  project      = sentry_project.web.slug
  name         = "preview"
}
```

### 1.5 TFC variable strategy (secrets **outside** state)

**Recommended:** Create a **Variable Set** named `sentry-shared` with:

* `SENTRY_AUTH_TOKEN` (env var, Sensitive) — the token from a Sentry **Internal Integration** with `project:write`/`org:read` scopes.
* Optionally: `SENTRY_ORG` (terraform var), `SENTRY_BASE_URL` (env) for self‑hosted.

Attach the set to the `sentry-infra` workspace (and any others needing Sentry). Prefer **Variable Sets** over per‑workspace vars to keep it DRY.

> **Write‑only / Ephemeral secrets:** If you manage TFC variables **via code** (the `hashicorp/tfe` provider), prefer using **write‑only** arguments (where available) and mark variables **Sensitive** so values don’t land in plan output. For most teams, managing TFC variable sets through the UI (or API) is simplest and safest.

---

## 2) Next.js 15 application integration

### 2.1 Install the SDK (wizard)

From your app repo:

```bash
npx @sentry/wizard@latest -i nextjs
# or: npm i @sentry/nextjs --save
```

The wizard will create the standard files and wire your Next.js config for sourcemaps and releases.

### 2.2 `next.config.mjs` (wrap your config)

```js
// next.config.mjs
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  // your Next.js config here
};

export default withSentryConfig(nextConfig, {
  // Optional: extra Sentry webpack plugin opts go here
  // org/project can come from env (preferred) or be hardcoded
  // sentry: { org: process.env.SENTRY_ORG, project: process.env.SENTRY_PROJECT }
});
```

### 2.3 SDK config files

**Client** — `sentry.client.config.ts`

```ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE
    ? Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE)
    : 0.1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.captureConsoleIntegration({ levels: ["error"] }),
    Sentry.replayIntegration(),
    // Optional: browser profiling (beta)
    // new (await import("@sentry/profiling-browser")).ProfilingIntegration(),
  ],
  sendDefaultPii: false, // keep PII off by default
  beforeSend(event) {
    // Example scrub
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
  environment:
    process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
});
```

**Server (Node)** — `sentry.server.config.ts`

```ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE
    ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE)
    : 0.1,
  profilesSampleRate: 0.05, // Node profiling (adjust by volume)
  sendDefaultPii: false,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
  release: process.env.SENTRY_RELEASE,
});
```

**Edge** — `sentry.edge.config.ts` (for Route Handlers on the Edge, if used)

```ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
});
```

### 2.4 `instrumentation.ts` (App Router)

Create `instrumentation.ts` at the project root (or `src/`). Keep it slim; your SDK init lives in the Sentry config files above.

```ts
// instrumentation.ts
import * as Sentry from "@sentry/nextjs";

export async function register() {
  // reserved for one-time setup if needed
}

export async function onRequestError(err: unknown) {
  // Next.js calls this for unhandled errors in requests on the server/edge
  Sentry.captureException(err);
}
```

### 2.5 API routes & Server Actions

* **Route Handlers (App Router)** — wrap with `wrapRouteHandlerWithSentry`:

```ts
// app/api/hello/route.ts
import { wrapRouteHandlerWithSentry } from "@sentry/nextjs";

export const GET = wrapRouteHandlerWithSentry(async () => {
  throw new Error("Boom from route handler");
});
```

* **Server Actions** — wrap with `withServerActionInstrumentation`:

```ts
// app/actions.ts
"use server";
import * as Sentry from "@sentry/nextjs";

export async function submitOrder(formData: FormData) {
  return Sentry.withServerActionInstrumentation(
    "submitOrder",
    { formData, recordResponse: true },
    async () => {
      // your code ...
      throw new Error("Order failed");
    }
  );
}
```

* **Pages Router API routes** (if you still have `/pages/api`) — use `wrapApiHandlerWithSentry(handler)`.

### 2.6 Source maps & releases on Vercel

* Ensure the Vercel project has these **Environment Variables**:
  * `NEXT_PUBLIC_SENTRY_DSN` = Terraform output `dsn_public`.
  * `SENTRY_AUTH_TOKEN` (Sensitive) — allows the webpack plugin to upload source maps.
  * `SENTRY_ORG`, `SENTRY_PROJECT` — to scope uploads (or configure via `withSentryConfig` options).
  * `SENTRY_RELEASE` (optional) — if you want SemVer releases; otherwise the plugin uses commit SHA.
  * (Optional) `NEXT_PUBLIC_SENTRY_RELEASE` — to make the release visible in the browser SDK (for breadcrumb correlation).
* Set the variables for **Production** and **Preview** in Vercel so every merge/release uploads maps.

CLI example to set them (repeat for `production` and `preview`):

```bash
vercel env add NEXT_PUBLIC_SENTRY_DSN production   # paste TF output
vercel env add SENTRY_AUTH_TOKEN production        # paste token
vercel env add SENTRY_ORG production               # e.g. your‑org
vercel env add SENTRY_PROJECT production           # e.g. web-app
```

> **Alternative:** Install Sentry’s **Vercel Integration** and link the Vercel project to your Sentry project. It will manage the auth token and source map uploads for you.

### 2.7 Tracing, Web Vitals, Profiling, Session Replay

* **Tracing** is enabled via `tracesSampleRate`.
* **Web Vitals** (LCP/CLS/INP) are collected and visible under Performance → Web Vitals.
* **Profiling** (browser & Node) can be enabled with the profiling integrations.
* **Session Replay** is enabled via `replayIntegration()` and the replay sample rates.

Tune sample rates per‑environment (e.g., `production` lower than `preview`).

---

## 3) CI/CD with GitHub → Vercel and GitHub → TFC

* **App repo**: You already deploy on each merge to `main` via Vercel.
* **Infra repo**: Connect your Terraform repo to **Terraform Cloud VCS** (GitHub App). Every change to `infra/` triggers a TFC run that amends Sentry config.

**Recommended repo layout:**

```
/infra       # Terraform for Sentry
/app         # Next.js 15 app
```

---

## 4) Disaster recovery & drift control checklist

* Pin provider versions (`jianyuan/sentry ~> 0.14.6`) and Terraform version in `required_version`.
* Keep DSNs and environment names as **outputs** so Platform can re-seed Vercel quickly.
* Check in **alerts, data filters, team membership, integrations** — run `terraform plan` to detect drift.
* For environments: either let them appear from traffic, or pre‑create them (§1.4).
* Use **TFC Variable Sets** for tokens; rotate tokens regularly. Document how to re-create the Internal Integration token.

---

## 5) Security & PII

* Keep `sendDefaultPii: false` unless you have a deliberate reason.
* Use `beforeSend`/`beforeSendTransaction` to scrub sensitive fields (e.g., cookies, auth headers).
* Consider Sentry’s server‑side **Data Scrubbing** rules for defense‑in‑depth (org/project level).

---

## 6) Quick start — copy/paste

1. Create a new GitHub repo `infra/` with the Terraform from §1.2–1.3.
2. In **TFC**, create a workspace `sentry-infra` and a **Variable Set** with `SENTRY_AUTH_TOKEN` (Sensitive) and your org slug.
3. `terraform init && terraform apply` to create team/project/alerts and get `dsn_public`.
4. In **Vercel**, set `NEXT_PUBLIC_SENTRY_DSN` to the TF output and add `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`.
5. In the **app repo**, run `npx @sentry/wizard@latest -i nextjs`, review configs (§2.3–2.5), commit.
6. Merge to `main` → Vercel builds → source maps upload → errors & performance appear in Sentry.

---

## Appendix A — example inbound data filters

```hcl
resource "sentry_project_inbound_data_filter" "filters" {
  organization = var.sentry_org_slug
  project      = sentry_project.web.slug

  browser_extensions = true
  localhost          = true
  web_crawlers       = true
}
```

## Appendix B — typical env var mapping

| Purpose | Server (Node) | Browser |
|---|---|---|
| DSN | `SENTRY_DSN` or `NEXT_PUBLIC_SENTRY_DSN` | `NEXT_PUBLIC_SENTRY_DSN` |
| Org / Project | `SENTRY_ORG` / `SENTRY_PROJECT` | (not required) |
| Auth token (maps upload) | `SENTRY_AUTH_TOKEN` | — |
| Release name | `SENTRY_RELEASE` | `NEXT_PUBLIC_SENTRY_RELEASE` |
| Environment | `VERCEL_ENV` | `NEXT_PUBLIC_VERCEL_ENV` |

---

## References & further reading

* Sentry Terraform provider (officially sponsored): Registry & repo  
  https://registry.terraform.io/providers/jianyuan/sentry/latest/docs  
  https://github.com/jianyuan/terraform-provider-sentry

* Sentry product post (Terraform)  
  https://blog.sentry.io/introducing-terraform-for-sentry/

* Key resources (examples)  
  Issue alerts (v2 schema): https://registry.terraform.io/providers/jianyuan/sentry/latest/docs/resources/issue_alert  
  Metric alerts: https://registry.terraform.io/providers/jianyuan/sentry/latest/docs/resources/metric_alert  
  Project: https://github.com/jianyuan/terraform-provider-sentry/blob/main/docs/resources/project.md?plain=1  
  Data filters: https://registry.terraform.io/providers/jianyuan/sentry/latest/docs/resources/project_inbound_data_filter  
  DSN & client keys: https://docs.sentry.io/concepts/key-terms/dsn-explainer/

* Terraform Cloud variables & variable sets  
  https://developer.hashicorp.com/terraform/cloud-docs/variables  
  https://developer.hashicorp.com/terraform/cloud-docs/variables/managing-variables

* Next.js + Sentry docs  
  Getting started / Manual setup / Build options / Source maps / APIs  
  https://docs.sentry.io/platforms/javascript/guides/nextjs/  
  https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/  
  https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/build/  
  https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/  
  https://docs.sentry.io/platforms/javascript/guides/nextjs/apis/

* App Router instrumentation & error handling (Next.js)  
  https://nextjs.org/docs/app/guides/instrumentation  
  https://nextjs.org/docs/app/getting-started/error-handling

* Vercel integration & environment variables  
  https://docs.sentry.io/organization/integrations/deployment/vercel/  
  https://vercel.com/docs/environment-variables/overview

* PII & data scrubbing  
  https://docs.sentry.io/platforms/javascript/data-management/sensitive-data/  
  https://docs.sentry.io/security-legal-pii/scrubbing/
