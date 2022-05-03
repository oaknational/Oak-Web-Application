alter table "public"."users" add column "createdAt" timestamptz
 not null default now();
