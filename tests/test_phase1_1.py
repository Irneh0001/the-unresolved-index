import json, os, subprocess, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
NODE=os.environ.get('NODE_BIN','node')
def snapshot():
 code="import {researchTopics as topics} from './data/research/topics.js'; import {researchQueue as queue} from './data/research/queue.js'; import {assessmentNotes} from './data/research/assessment_notes.js'; console.log(JSON.stringify({topics,queue,assessmentNotes}));"
 return json.loads(subprocess.check_output([NODE,'--input-type=module','-e',code],cwd=ROOT,text=True))
class EpistemicBaselineTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls): cls.data=snapshot()
 def test_all_topics_have_reviewed_assessments(self):
  self.assertEqual(20,len(self.data['topics']))
  self.assertTrue(all(t['assessment_status']=='researched' for t in self.data['topics']))
  self.assertTrue(all(t['status']=='active' for t in self.data['topics']))
 def test_all_topics_have_priority(self):
  self.assertTrue(all(x['priority'] is not None for x in self.data['queue']))
 def test_queue_dates_absent_until_run(self): self.assertTrue(all(x['created_at'] is None for x in self.data['queue']))
 def test_reviewed_frequency(self): self.assertTrue(all(x['frequency']=='daily' for x in self.data['queue']))
 def test_audit_is_dynamic_and_infrastructure_only(self):
  text=(ROOT/'scripts/write_audit.py').read_text(); self.assertIn('research_mode',text); self.assertIn('len(queue)',text); self.assertNotIn('Topics queued: 20',text)
 def test_no_research_is_distinct_from_no_change(self):
  self.assertIn('no_research_performed', (ROOT/'scripts/write_audit.py').read_text()); self.assertIn('infrastructure_only',(ROOT/'.github/workflows/research-daily.yml').read_text())
 def test_forecast_history_guard_exists(self): self.assertTrue((ROOT/'scripts/verify_history.py').exists())
 def test_existing_site_entrypoint_unchanged(self): self.assertIn('js/app.js',(ROOT/'index.html').read_text())
 def test_all_topics_have_assessment_dimensions(self):
  for topic in self.data['topics']:
   dimensions=self.data['assessmentNotes'][topic['id']]['dimensions']
   for key in ('importance','substantive_uncertainty','institutional_disagreement','decision_incompleteness','momentum'):
    expected=topic['importance'] if key=='importance' else topic['uncertainty'] if key=='substantive_uncertainty' else topic[key]
    self.assertEqual(expected,dimensions[key]['value'])
    self.assertTrue(dimensions[key]['basis'])
if __name__=='__main__': unittest.main()
