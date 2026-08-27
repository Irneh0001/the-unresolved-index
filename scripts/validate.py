"""Dependency-free integrity validation for Phase 1 records."""
from pathlib import Path
import json, os, subprocess, sys
ROOT = Path(__file__).resolve().parents[1]
NODE = os.environ.get("NODE_BIN", "node")
JS = """import {researchTopics as topics} from './data/research/topics.js';import {claims} from './data/research/claims.js';import {sources} from './data/research/sources.js';import {events} from './data/research/events.js';import {forecasts} from './data/research/forecasts.js';console.log(JSON.stringify({topics,claims,sources,events,forecasts}));"""
def records():
    return json.loads(subprocess.check_output([NODE, "--input-type=module", "-e", JS], cwd=ROOT, text=True))
def unique(rows, label, errors):
    ids=[x['id'] for x in rows]
    if len(ids)!=len(set(ids)): errors.append(f"duplicate {label} IDs")
def main():
    d=records(); errors=[]; valid_status={"resolved","partially_resolved","active","deeply_unresolved","dormant"}; topic_ids={x['id'] for x in d['topics']}; source_ids={x['id'] for x in d['sources']}
    for key in d: unique(d[key], key, errors)
    for t in d['topics']:
        if t['status'] is not None and t['status'] not in valid_status: errors.append(f"{t['id']}: invalid topic status")
        if t.get('assessment_status') not in {'unassessed','provisional','researched'}: errors.append(f"{t['id']}: invalid assessment status")
        if t.get('assessment_status')=='unassessed' and t['status'] is not None: errors.append(f"{t['id']}: unassessed topic cannot claim unresolved status")
        if not t['definition_of_resolved']: errors.append(f"{t['id']}: missing definition_of_resolved")
        for score in ('importance','uncertainty','institutional_disagreement','momentum','decision_incompleteness'):
            if t[score] is not None and not 0 <= t[score] <= 100: errors.append(f"{t['id']}: invalid {score}")
    for c in d['claims']:
        if c['topic_id'] not in topic_ids: errors.append(f"{c['id']}: broken topic reference")
        if c['status']!='unverified' and not c['source_ids']: errors.append(f"{c['id']}: claim needs evidence")
        if any(s not in source_ids for s in c['source_ids']): errors.append(f"{c['id']}: broken source reference")
    for e in d['events']:
        if e['topic_id'] not in topic_ids: errors.append(f"{e['id']}: broken topic reference")
    for f in d['forecasts']:
        if f['topic_id'] not in topic_ids: errors.append(f"{f['id']}: broken topic reference")
        if not 0<=f['confidence']<=100 or not f['rationale'] or not f['evidence_ids']: errors.append(f"{f['id']}: invalid forecast")
        if any(not 0<=p<=100 for p in f['probabilities'].values()): errors.append(f"{f['id']}: invalid probability")
    if errors: print('\n'.join(errors)); return 1
    print(f"PASS: {len(d['topics'])} topics, {len(d['claims'])} claims, {len(d['sources'])} sources, {len(d['events'])} events, {len(d['forecasts'])} forecasts")
    return 0
if __name__=='__main__': sys.exit(main())
