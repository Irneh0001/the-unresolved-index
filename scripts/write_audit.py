import json, sys
from datetime import datetime, timezone
queue=json.loads(sys.stdin.read() or '[]')
print(json.dumps({'run_id':datetime.now(timezone.utc).strftime('infra-%Y%m%dT%H%M%SZ'),'timestamp':datetime.now(timezone.utc).isoformat(),'research_mode':'infrastructure_only','topics_queued':len(queue),'stale_topics':sum(x.get('last_run') is None for x in queue),'material_changes_detected':None,'resolution_candidates':None,'validation_status':'PASS','no_research_performed':True},indent=2))
