import "dotenv/config";

/**
 * Query PostHog for an "audience" — a set of *identified* persons matching a
 * condition — and print how many match (with a small sample). This is the read
 * half of a one-time backfill: once you're happy with an audience, feed the ids
 * into an `update_property` loop to set a person property.
 *
 * How it works
 * ------------
 * HogQL won't let you join the `persons` table to an `events` subquery in one
 * query, so we run two single-table queries and combine them in code:
 *
 *   1. UNIVERSE  — every identified person (`SELECT id FROM persons`, ~5k).
 *   2. EVENT SET — persons matching an event condition, defined per audience as
 *                  a `HAVING` expression over `events` grouped by `person_id`.
 *
 * The audience is then UNIVERSE ∩ EVENT SET ("did X") or UNIVERSE \ EVENT SET
 * ("never did X"), depending on `mode`. Intersecting with the universe keeps
 * anonymous, ephemeral event ids out of the result.
 *
 * Usage:
 *   pnpm exec tsx scripts/dev/posthog/audiences.ts <audience>
 *   pnpm exec tsx scripts/dev/posthog/audiences.ts            # lists audiences
 */

const isDevEnvironment = true;

const POSTHOG_HOST = "https://eu.posthog.com";
const PROJECT_ID = isDevEnvironment ? "124" : "125";
const PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY ?? "";

const PAGE = 1000;

// --- Tunables (adjust per academic calendar / event taxonomy) ---

// Events that count as a "download".
const DOWNLOAD_EVENTS = [
  "Lesson Plan Resources Downloaded",
  "Lesson Resources Downloaded",
  "Lesson Activity Downloaded",
  "Teaching Material Downloaded",
  "Curriculum Resources Downloaded",
  "Lesson Resource Download Started",
  "Unit Download Initiated",
];

// UK academic calendar boundaries — change to the year you care about.
const LAST_YEAR_START = "2024-09-01 00:00:00";
const TERM_END = "2025-07-18 00:00:00";

const eventList = (events: string[]) =>
  events.map((e) => `'${e.replace(/'/g, "\\'")}'`).join(", ");

// --- Audience definitions ---
// `having` is a HogQL boolean over per-person aggregates of the `events` table
// and defines the EVENT SET. `mode` says whether the audience is persons who
// are IN that set ("did X") or NOT IN it ("never did X").

type SetProperty = { key: string; value: boolean }[];

type Audience = {
  description: string;
  having: string;
  mode: "in" | "notIn";
  setProperty?: SetProperty;
};

const AUDIENCES: Record<string, Audience> = {
  "never-downloaded": {
    description: "Identified persons who have never downloaded",
    having: `countIf(event IN (${eventList(DOWNLOAD_EVENTS)})) > 0`,
    mode: "notIn",
    // In the new sign ups route, identify the user, check if they've downloaded and then set the property
    // in the download event tracking actions, set has_downloaded to true
    setProperty: [
      { key: "has_downloaded", value: false },
      { key: "has_seen_download_banner", value: false },
    ],
  },

  "recently-onboarded": {
    description: "Completed onboarding in the last 7 days",
    having: `countIf(
      event = 'User Onboarding Completed' AND timestamp > now() - INTERVAL 7 DAY
    ) > 0`,
    mode: "in",
    // In the onboarding completed event set recently-onboarded to true
    // When an action is triggered (i.e. they've seen a banner) set recently-onboarded to false
    setProperty: [{ key: "recently-onboarded", value: true }],
  },

  "lapsed-since-term-end": {
    description: "Active during last academic year but not since term ended",
    having: `countIf(
      timestamp BETWEEN toDateTime('${LAST_YEAR_START}')
                    AND toDateTime('${TERM_END}')
    ) > 0
    AND countIf(timestamp > toDateTime('${TERM_END}')) = 0`,
    mode: "in",
    //
    setProperty: [{ key: "lapsed_since_term_end", value: true }],
  },
};

// --- Generic HTTP + query helpers ---

async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  attempt = 1,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${PERSONAL_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Respect PostHog's rate limiter: on 429 wait for the advertised window
  // (Retry-After, in seconds) and retry rather than failing the person.
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("Retry-After")) || 1;
    console.log("throttle retry");
    await sleep(retryAfter * 1000);
    return apiFetch<T>(url, options, attempt);
  }

  // Transient upstream errors (502/503/504) — retry a few times with
  // exponential backoff before giving up on the person.
  if (response.status >= 502 && response.status <= 504 && attempt <= 5) {
    const waitTime = 2 ** attempt * 250;
    console.log("retrying Error:", response.status, "waiting for:", waitTime);
    await sleep(waitTime);
    return apiFetch<T>(url, options, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(
      `Request failed [${response.status}]: ${await response.text()}`,
    );
  }

  // Some endpoints (e.g. the persons PATCH) reply with an empty body, so
  // calling response.json() directly would throw "Unexpected end of JSON
  // input". Parse only when there's actually content.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface HogQLPersonIdResponse {
  results: [string][]; // [pid]
}

/**
 * Run a HogQL query that selects a single person-id column, keyset-paginating
 * on that column. Personal-API-key queries can't use OFFSET, so the query must
 * order by the id and filter `> '{cursor}'`, which `buildQuery` receives.
 */
async function keysetPaginate(
  buildQuery: (cursor: string) => string,
): Promise<string[]> {
  const ids: string[] = [];
  let cursor = ""; // "" sorts before every id, so the first page starts at the top

  for (;;) {
    const query = buildQuery(cursor);
    const data = await apiFetch<HogQLPersonIdResponse>(
      `${POSTHOG_HOST}/api/environments/${PROJECT_ID}/query/`,
      {
        method: "POST",
        body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
      },
    );

    for (const [id] of data.results) ids.push(id);

    if (data.results.length < PAGE) break;

    const last = data.results[data.results.length - 1];
    if (!last) break;
    cursor = last[0];
    await sleep(200);
  }

  return ids;
}

const personUniverseQuery = (cursor: string) => `
  SELECT toString(id) AS pid
  FROM persons
  WHERE toString(id) > '${cursor}'
  ORDER BY pid
  LIMIT ${PAGE}
`;

const eventSetQuery = (having: string) => (cursor: string) => `
  SELECT toString(person_id) AS pid
  FROM events
  WHERE toString(person_id) > '${cursor}'
  GROUP BY person_id
  HAVING ${having}
  ORDER BY pid
  LIMIT ${PAGE}
`;

async function collectAudience(audience: Audience): Promise<string[]> {
  console.log("  fetching identified person universe…");
  const universe = await keysetPaginate(personUniverseQuery);

  console.log("  fetching event-matched persons…");
  const eventSet = new Set(
    await keysetPaginate(eventSetQuery(audience.having)),
  );

  return universe.filter((id) =>
    audience.mode === "in" ? eventSet.has(id) : !eventSet.has(id),
  );
}

// --- Backfill ---

/**
 * PATCH person properties via the Persons API.
 * Sends every property in a single request and does NOT fire a billable
 * event — it updates the person record directly.
 */
async function patchPersonProperties(
  personId: string,
  properties: SetProperty,
): Promise<void> {
  await apiFetch(
    `${POSTHOG_HOST}/api/environments/${PROJECT_ID}/persons/${personId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({
        properties: Object.fromEntries(
          properties.map((property) => [property.key, property.value]),
        ),
      }),
    },
  );
}

/**
 * Update a property for every person in `ids`.
 * Logs progress every 100 persons and prints a summary at the end.
 */
async function backfillPersonProperty(
  ids: string[],
  properties: SetProperty,
): Promise<void> {
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    try {
      await patchPersonProperties(id!, properties);
      succeeded++;
    } catch (err) {
      failed++;
      console.warn(`  ✗ Failed to update ${id}: ${err}`);
    }

    if ((i + 1) % 100 === 0 || i === ids.length - 1) {
      console.log(
        `  … ${i + 1}/${ids.length} processed — ` +
          `${succeeded} updated, ${failed} failed`,
      );
    }

    await sleep(100); // ~10 req/s — adjust if you hit rate limits
  }

  console.log(
    `\nBackfill complete. Set ${properties.map((property) => `${property.key}=${property.value}`)} on ${succeeded} persons` +
      (failed > 0 ? ` (${failed} errors — re-run to retry)` : "."),
  );
}

// --- CLI ---

async function main() {
  if (!PERSONAL_API_KEY) {
    throw new Error(
      "POSTHOG_PERSONAL_API_KEY environment variable is not set.",
    );
  }
  const args = process.argv.slice(2);
  const name = args.find((a) => !a.startsWith("--"));
  const apply = args.includes("--apply");
  const audience = name ? AUDIENCES[name] : undefined;

  if (!name || !audience) {
    console.log("Available audiences:\n");
    for (const [key, a] of Object.entries(AUDIENCES)) {
      console.log(`  ${key.padEnd(24)} ${a.description}`);
    }
    console.log(
      "\nUsage: pnpm exec tsx scripts/dev/posthog/audiences.ts <audience>",
    );
    process.exit(name ? 1 : 0);
  }

  console.log(`Audience: ${name} — ${audience.description}`);

  const ids = await collectAudience(audience);

  if (!apply) {
    console.log(`\nMatched ${ids.length} persons.`);
    console.log("Sample (first 5):");
    ids.slice(0, 5).forEach((id) => console.log(`  id=${id}`));
    if (audience.setProperty) {
      for (let property of audience.setProperty) {
        console.log("would have set", property.key, "to", property.value);
      }
    }
    return;
  } else if (audience.setProperty) {
    await backfillPersonProperty(ids, audience.setProperty);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
