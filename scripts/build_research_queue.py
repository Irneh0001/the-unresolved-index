import subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
out=subprocess.check_output(['node','--input-type=module','-e',"import {researchQueue as q} from './data/research/queue.js';console.log(JSON.stringify(q));"],cwd=ROOT,text=True)
print(f"Topics queued: {len(__import__('json').loads(out))}")
