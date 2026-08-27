import json, os, subprocess, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
NODE=os.environ.get('NODE_BIN','node')
def snapshot():
 code="import {researchTopics as topics} from './data/research/topics.js'; import {researchQueue as queue} from './data/research/queue.js'; console.log(JSON.stringify({topics,queue}));"
 return json.loads(subprocess.check_output([NODE,'--input-type=module','-e',code],cwd=ROOT,text=True))
class EpistemicBaselineTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls): cls.data=snapshot()
 def test_unassessed_is_not_deeply_unresolved(self):
  unassessed=[t for t in self.data['topics'] if t['assessment_status']=='unassessed']
  self.assertTrue(unassessed); self.assertTrue(all(t['status'] is None for t in unassessed))
 def test_unassessed_has_no_priority(self): self.assertTrue(all(x['priority'] is None for x in self.data['queue']))
 def test_disagreement_not_derived(self): self.assertTrue(all(t['institutional_disagreement'] is None for t in self.data['topics']))
 def test_decision_incompleteness_not_85(self): self.assertTrue(all(t['decision_incompleteness'] is None for t in self.data['topics']))
 def test_queue_dates_absent_until_run(self): self.assertTrue(all(x['created_at'] is None for x in self.data['queue']))
 def test_conservative_frequency(self): self.assertTrue(all(x['frequency']=='weekly' for x in self.data['queue']))
 def test_audit_is_dynamic_and_infrastructure_only(self):
  text=(ROOT/'scripts/write_audit.py').read_text(); self.assertIn('research_mode',text); self.assertIn('len(queue)',text); self.assertNotIn('Topics queued: 20',text)
 def test_no_research_is_distinct_from_no_change(self):
  self.assertIn('no_research_performed', (ROOT/'scripts/write_audit.py').read_text()); self.assertIn('infrastructure_only',(ROOT/'.github/workflows/research-daily.yml').read_text())
 def test_forecast_history_guard_exists(self): self.assertTrue((ROOT/'scripts/verify_history.py').exists())
 def test_existing_site_entrypoint_unchanged(self): self.assertIn('js/app.js',(ROOT/'index.html').read_text())
if __name__=='__main__': unittest.main()
