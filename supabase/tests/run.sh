#!/usr/bin/env bash
# ============================================================
# Validate the Fase 1 migrations against a throwaway Postgres.
#
# Applies stubs -> every migration in order -> the assertion suite,
# then destroys the container. Nothing here touches a real Supabase
# project; it exists so the schema and RLS can be proven before being
# pushed anywhere (IMPLEMENTATION.md Fase 1 exit criteria).
#
# Usage: bash supabase/tests/run.sh
# ============================================================
set -euo pipefail

CONTAINER=pf_pg_test
IMAGE=postgres:16-alpine
DB=portfolio_test
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cleanup() { docker rm -f "$CONTAINER" >/dev/null 2>&1 || true; }
trap cleanup EXIT
cleanup

echo "==> starting $IMAGE"
docker run -d --name "$CONTAINER" \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB="$DB" \
  "$IMAGE" >/dev/null

# pg_isready is not enough: the entrypoint starts a temporary server to
# run initdb, then shuts it down and starts the real one. Waiting on an
# actual query avoids connecting to that short-lived instance.
ready=0
for _ in $(seq 1 90); do
  if docker exec "$CONTAINER" psql -U postgres -d "$DB" -tAc 'select 1' >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 1
done

if [ "$ready" -ne 1 ]; then
  echo "postgres did not become ready" >&2
  docker logs "$CONTAINER" 2>&1 | tail -20 >&2
  exit 1
fi

# ON_ERROR_STOP turns a failed assertion into a non-zero exit instead of
# a warning that scrolls past.
run_sql() {
  docker exec -i "$CONTAINER" psql -v ON_ERROR_STOP=1 -U postgres -d "$DB" < "$1"
}

echo "==> applying stubs"
run_sql "$ROOT/supabase/tests/00_stubs.sql"

echo "==> applying migrations"
for f in "$ROOT"/supabase/migrations/*.sql; do
  echo "    $(basename "$f")"
  run_sql "$f"
done

echo "==> applying seed"
run_sql "$ROOT/supabase/seed.sql"

# Seeding twice proves the ON CONFLICT / NOT EXISTS guards hold: the
# seed is re-run whenever a local or staging database is rebuilt.
echo "==> applying seed again (idempotency)"
run_sql "$ROOT/supabase/seed.sql"

echo "==> running assertions"
run_sql "$ROOT/supabase/tests/01_rls_test.sql"

echo "==> OK"
