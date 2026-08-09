"""Deterministic event classifier; no fetching, AI, or publication."""
ORDER=['no_change','context_only','material_change','structural_change','resolution_candidate']
MAP={'noise':'no_change','context':'context_only','material':'material_change','structural':'structural_change','resolution_candidate':'resolution_candidate'}
def classify(events):
    return max((MAP.get(e.get('materiality'),'no_change') for e in events), key=ORDER.index, default='no_change')
if __name__=='__main__': print(classify([]))
