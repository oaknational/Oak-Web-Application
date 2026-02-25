#!/bin/bash
DATA_DIR="./firestore-data"

echo ""
echo "  Firestore UI: http://localhost:4000/firestore/default/data"
echo ""

IMPORT_FLAG=""
if [ -f "$DATA_DIR/firebase-export-metadata.json" ]; then
  IMPORT_FLAG="--import=$DATA_DIR"
fi

exec firebase emulators:start --only firestore $IMPORT_FLAG --export-on-exit="$DATA_DIR"
