"""Reject removal of existing Phase 1 forecast history lines in CI."""
import os, subprocess, sys
base=os.environ.get('HISTORY_BASE_SHA')
if not base: print('No history base supplied; check skipped.'); raise SystemExit(0)
diff=subprocess.check_output(['git','diff','--unified=0',base,'HEAD','--','data/research/forecasts.js'],text=True)
if any(line.startswith('-') and not line.startswith('---') for line in diff.splitlines()):
 print('Historical forecasts are append-only; removal requires an explicit migration.'); raise SystemExit(1)
print('Forecast history preservation check passed.')
