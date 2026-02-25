#!/bin/bash
set -m

./scripts/dev/firestore-emulator.sh &
FIREBASE_PID=$!

next dev --experimental-https &
NEXT_PID=$!

# On Ctrl+C: stop next, then tell firebase to shut down and export data.
# The trap "" line stops this from running twice if Ctrl+C is pressed again.
trap 'trap "" INT TERM; kill $NEXT_PID 2>/dev/null; kill -INT $FIREBASE_PID 2>/dev/null; wait $FIREBASE_PID 2>/dev/null; exit 0' INT TERM

wait
