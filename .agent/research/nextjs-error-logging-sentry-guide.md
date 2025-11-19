# Next.js 16 Error Handling, Logging & Sentry Integration Guide

## 1. Overview

This guide describes a complete error-handling and logging architecture
for **Next.js 16** using:

- **neverthrow** --- explicit, typed error handling
- **Pino** --- structured Node‑runtime logging
- **Sentry** --- unified error + log monitoring
- **Edge-safe logging** using `console` + Sentry

The approach supports: - Frontend components (client/server) - API
routes (Node runtime) - Edge functions - Type‑safe and explicitly
handled errors everywhere

------------------------------------------------------------------------

## 2. Stack Summary

### Error Handling --- `neverthrow`

Use `Result<T, E>` / `ResultAsync<T, E>` to force explicit handling of
success and error cases.

### Logging --- Pino (Node runtime)

- Fast structured logging
- Fully compatible with Sentry via `pinoIntegration`

### Logging --- Edge & Browser

- `console` and `Sentry.logger`
- Sentry's console logging integration

### Error Monitoring --- Sentry

- `@sentry/nextjs` handles client, server, and edge runtimes
- Sentry Logs unify application logs and error events

------------------------------------------------------------------------

## 3. Sentry Configuration

### File: `sentry.server.config.ts`

``` ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enableLogs: true,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.pinoIntegration({
      log: { levels: ['info', 'warn', 'error'] },
      error: { levels: ['error', 'fatal'] },
    }),
  ],
});
```

### File: `sentry.edge.config.ts`

``` ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enableLogs: true,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],
});
```

### File: `sentry.client.config.ts`

Similar to `edge.config.ts`, also using console logging integration.

------------------------------------------------------------------------

## 4. Pino Logger (Node Runtime Only)

### File: `src/server/logger.ts`

``` ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: { service: 'oak-next-frontend' },
  ...(process.env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }
    : {}),
});

export const log = {
  info: (msg: string, ctx?: Record<string, unknown>) => logger.info(ctx ?? {}, msg),
  warn: (msg: string, ctx?: Record<string, unknown>) => logger.warn(ctx ?? {}, msg),
  error: (msg: string, ctx?: Record<string, unknown>) => logger.error(ctx ?? {}, msg),
};
```

Only import this from Node runtime ("`runtime = 'nodejs'`") code.

------------------------------------------------------------------------

## 5. Domain Errors & neverthrow

### File: `src/domain/errors.ts`

``` ts
export type NotFoundError = {
  type: 'NotFoundError';
  entity: 'User' | 'Lesson';
  id: string;
};

export type ValidationError = {
  type: 'ValidationError';
  message: string;
  details?: unknown;
};

export type PermissionError = {
  type: 'PermissionError';
  action: string;
};

export type UnknownError = {
  type: 'UnknownError';
  message: string;
  cause?: unknown;
};

export type DomainError =
  | NotFoundError
  | ValidationError
  | PermissionError
  | UnknownError;
```

### Example Service Function

``` ts
import { Result, ok, err } from 'neverthrow';
import type { DomainError } from '../errors';

export async function getUserById(id: string): Promise<Result<User, DomainError>> {
  try {
    const user = await db.users.findById(id);

    if (!user) {
      return err({
        type: 'NotFoundError',
        entity: 'User',
        id,
      });
    }

    if (!user.isActive) {
      return err({
        type: 'PermissionError',
        action: 'view_inactive_user',
      });
    }

    return ok(user);
  } catch (cause) {
    return err({
      type: 'UnknownError',
      message: 'Unexpected error fetching user',
      cause,
    });
  }
}
```

------------------------------------------------------------------------

## 6. Central Error Handler (Node Runtime)

### File: `src/server/error-reporting.ts`

``` ts
import * as Sentry from '@sentry/nextjs';
import { log } from './logger';
import type { DomainError } from '@/domain/errors';

export function mapDomainErrorToHttpStatus(err: DomainError): number {
  switch (err.type) {
    case 'ValidationError': return 400;
    case 'PermissionError': return 403;
    case 'NotFoundError': return 404;
    case 'UnknownError': return 500;
    default: {
      const _exhaustive: never = err;
      return 500;
    }
  }
}

export function handleDomainError(err: DomainError) {
  log.error('Domain error', { err });

  const shouldCapture =
    err.type === 'UnknownError' || err.type === 'ValidationError';

  if (shouldCapture) {
    Sentry.captureException(new Error(err.type), (scope) => {
      scope.setTag('domain.error_type', err.type);
      scope.setContext('domain.error', err);
      return scope;
    });
  }

  return mapDomainErrorToHttpStatus(err);
}
```

------------------------------------------------------------------------

## 7. API Route Example (Node Runtime)

### File: `app/api/users/[id]/route.ts`

``` ts
import { NextResponse } from 'next/server';
import { getUserById } from '@/domain/users/getUser';
import { handleDomainError } from '@/server/error-reporting';
import { log } from '@/server/logger';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const result = await getUserById(params.id);

  return result.match({
    ok: (user) => {
      log.info('Fetched user', { userId: user.id });
      return NextResponse.json(user, { status: 200 });
    },
    err: (error) => {
      const status = handleDomainError(error);
      return NextResponse.json(
        {
          error: error.type,
          message: error.type === 'ValidationError' ? error.message : 'Something went wrong',
        },
        { status },
      );
    },
  });
}
```

------------------------------------------------------------------------

## 8. Edge Function Example

### File: `app/api/edge-example/route.ts`

``` ts
import * as Sentry from '@sentry/nextjs';

export const runtime = 'edge';

export async function GET() {
  Sentry.logger.info(Sentry.logger.fmt`Edge route hit`);
  console.log('Edge route hit'); // captured by Sentry console integration

  return new Response('ok');
}
```

------------------------------------------------------------------------

## 9. Client Usage Example

``` ts
import * as Sentry from '@sentry/nextjs';
import { Result } from 'neverthrow';
import type { DomainError } from '@/domain/errors';

export async function fetchUserClient(id: string): Promise<Result<User, DomainError>> {
  const res = await fetch(`/api/users/${id}`);

  if (!res.ok) {
    const body = await res.json();
    // Convert API error JSON to DomainError and return err(...)
  }

  return Result.ok(await res.json());
}
```

------------------------------------------------------------------------

## 10. Optional: Enforcing Exhaustiveness with ESLint

Enable:

``` json
"rules": {
  "@typescript-eslint/switch-exhaustiveness-check": "error"
}
```

This ensures every new error variant must be handled in all switch
statements.

------------------------------------------------------------------------

## 11. Extended Observability Toolkit

### 11.1 Distributed Tracing (OpenTelemetry)

- Register Next.js instrumentation via `instrumentation.ts` (see snippet below) so every route handler, fetch call, and server action emits spans.
- Export traces to Sentry Performance, Honeycomb, Grafana Tempo, Datadog, or AWS X-Ray using OTLP exporters.
- Tag spans with curriculum IDs, draft IDs, and tenant identifiers (redacted) to correlate latency spikes with specific workloads.

```ts
// instrumentation.ts
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({
    serviceName: 'oak-authoring',
    instrumentation: ['@opentelemetry/instrumentation-fetch'],
  });
}
```

### 11.2 Metrics & Health Signals

- Emit RED metrics (Rate, Errors, Duration) using the official OpenTelemetry JS SDKs (`@opentelemetry/sdk-node`, `@opentelemetry/sdk-metrics`, `@opentelemetry/exporter-metrics-otlp-http`) and stream them to Prometheus/Grafana Cloud, Datadog, or Sentry Metrics.
- Track Core Web Vitals by wiring `reportWebVitals` into PostHog or Sentry user feedback dashboards.
- Configure synthetic monitors (Checkly, Pingdom) for core routes (draft save, login, AI assist) with alerting routed to PagerDuty/Opsgenie.

### 11.3 Log Routing & Retention

- Forward Pino output through Vector/Fluent Bit to long-term storage (e.g., AWS OpenSearch, Google Cloud Logging) with ≥90-day retention.
- Apply redaction middleware (regex or zod-safe mapping) to strip draft content, PII, and tokens before logs leave Vercel.

### 11.4 Alerting & Runbooks

- Define SLOs (e.g., “99th percentile draft save <2s, error budget 0.5%”) and wire alert thresholds in Sentry and the metrics backend.
- Maintain runbooks describing mitigation steps (rollbacks, feature-flag disables, failover to cached curriculum data) and link them from alerts.

## 12. Developer Experience & Stability Enhancements

| Area | Recommended Practices |
| --- | --- |
| **Typed configuration** | Use `@t3-oss/env-nextjs` with Doppler to validate env vars at build/start; fail fast if secrets missing. |
| **Local parity** | Provide `pnpm dev:stack` that launches Next.js (Turbopack), Doppler, MSW mocks for curriculum API, and background workers for draft sync. |
| **Testing layers** | Vitest (unit) + MSW contract tests, Pact for API schemas, Playwright e2e per PR, Checkly smoke tests post-deploy. |
| **Static analysis** | ESLint flat config or Biome, TypeScript `strict`, dependency audit (`pnpm audit-ci`), circular dependency checks via Madge. |
| **Preview environments** | Every PR deploys to Vercel Preview with isolated Doppler configs, PostHog project, and Sentry environment for safe experimentation. |
| **Storybook & design QA** | Storybook 8 with Interaction Tests + Chromatic/Percy snapshots ensures Oak Component integration stays stable. |
| **Resilience testing** | Use libraries like `cockatiel` for retries/circuit breakers, inject latency/errors in Cypress/Playwright runs, and add chaos toggles (toxiproxy) to simulate upstream outages. |
| **Data guards** | Wrap all boundary data with Zod, neverthrow pipelines, and snapshot regressions for serialisers (curriculum payloads, draft storage, AI prompts). |

### 12.1 OpenTelemetry Implementation Notes

- **Node runtime:** create `instrumentation.ts` that instantiates `NodeSDK` from `@opentelemetry/sdk-node`, adds `OTLPTraceExporter`/`OTLPMetricExporter`, registers resource attributes (service name, version, deployment.environment), and calls `sdk.start()` during Next.js bootstrap (`instrumentation.ts` is auto-loaded in Next 16).
- **Browser runtime:** use `@opentelemetry/sdk-trace-web` with `OTLPTraceExporter` + `ZoneContextManager` for client spans, and wrap fetch/XHR instrumentation via `@opentelemetry/instrumentation-fetch`.
- **Metrics:** define RED counters histograms (`draft.save.requests`, `draft.save.errors`, `draft.save.duration`) with views/aggregations; export via OTLP to Sentry Metrics or Grafana. Avoid sampling for RED metrics; rely on view filters for tenant-specific SLOs.
- **No spike needed:** treat OTEL setup as required infra work in sprint 1; document standard pipelines (local -> OTLP collector -> vendor) so devs can run `pnpm dev:otel` to start collectors locally.

## 13. Sentry as an Observability Platform

### 13.1 Capabilities

- **Metrics:** Official docs describe Sentry Metrics as “counters, gauges, and distributions from your code to track application health and drill down into related traces, logs, and errors.”[^sentry-metrics]
- **Logs:** Sentry Logs accept structured payloads you can “send, view and query … within Sentry.”[^sentry-logs]
- **Errors/Traces/Profiling:** Core product still excels at issue grouping, performance spans, profiling, session replay, dashboards, alerting, and tight linkages between telemetry primitives (issues ↔ trace ↔ metric datapoints).
- **Workflow fit:** Single workspace view lets frontend/back-end engineers investigate regressions without pivoting between multiple vendors; alerts support Slack, PagerDuty, Opsgenie.

### 13.2 Limitations

- **Infra telemetry gaps:** No built-in host/node metrics, Kubernetes events, or network-level dashboards—teams needing infra observability still need Datadog, Prometheus/Grafana, AWS CloudWatch, etc.
- **Log volume economics:** Sentry Logs pricing/retention (30–90 days depending on plan) is designed for application logs, not petabyte-scale ingestion. Heavy back-end services may require external log pipelines (Vector → S3/BQ) for compliance.
- **Query ergonomics:** Discover/Logs queries are powerful but still app-centric (focus on breadcrumb & issue context). For advanced distributed tracing analysis (e.g., tail-based sampling, high-cardinality dimension slicing) Honeycomb or Grafana Tempo may offer better UX.
- **Vendor lock-in:** Metrics and logs stored in Sentry do not expose Prometheus-compatible APIs; migrating dashboards elsewhere later can be costly.

### 13.3 Recommendation (Vercel Hosting)

- Use **Sentry** as the primary application-layer observability plane (errors, performance, RED metrics, session replay, product analytics breadcrumbs) because engineers debug directly from issue to trace/log in one UI.
- Enable **Vercel Observability Plus** to capture platform-side metrics (function cold starts, edge cache performance, region-level error rates) and surface them alongside deployments; Vercel can forward these signals to Sentry automatically.
- Run an OTEL collector that can dual-export traces/metrics/logs if we later need longer retention or external analytics (Grafana Cloud, Datadog, Honeycomb). Keeping telemetry in OTEL semantic conventions makes future pivots straightforward.

## 14. Summary

This setup gives:

- Fully explicit, typed error handling using **neverthrow**
- Structured logs in **Pino** that automatically flow into **Sentry Logs**
- Sentry Errors plus distributed tracing, metrics, and runbooks for full-stack observability
- Unified logging and error analysis across:
  - Frontend
  - API routes
  - Server components
  - Edge routes
- Strong TypeScript exhaustiveness guarantees and hardened developer workflows

A production-grade, observable, and resilient system for Next.js 16.

[^sentry-metrics]: Sentry docs — “Metrics” page description: *“Send counters, gauges, and distributions from your code to track application health and drill down into related traces, logs, and errors.”* (<https://docs.sentry.io/product/explore/metrics/>, accessed 2025-11-19).
[^sentry-logs]: Sentry docs — “Logs” page description: *“Structured logs allow you to send, view and query logs and parameters sent from your applications within Sentry.”* (<https://docs.sentry.io/product/explore/logs/>, accessed 2025-11-19).
