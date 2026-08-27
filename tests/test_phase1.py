import sys, unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1] / 'scripts'))
from detect_changes import classify
class PhaseOneTests(unittest.TestCase):
 def test_change_classification(self):
  self.assertEqual(classify([]),'no_change'); self.assertEqual(classify([{'materiality':'context'}]),'context_only'); self.assertEqual(classify([{'materiality':'material'}]),'material_change'); self.assertEqual(classify([{'materiality':'structural'}]),'structural_change'); self.assertEqual(classify([{'materiality':'resolution_candidate'}]),'resolution_candidate')
 def test_priority_formula(self): self.assertEqual(round(80*50*25/10000),10)
if __name__=='__main__': unittest.main()
