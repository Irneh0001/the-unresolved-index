const seeds = [
  ["iran-war-end-state","Iran war & end-state","Geopolitics","Regional security","escalating",95,92,88],
  ["border-immigration","Border & immigration system","Governance","Immigration","structural",96,94,75],
  ["birthright-citizenship","Birthright citizenship","Law & rights","Citizenship","contested",83,84,76],
  ["epstein-accountability","Epstein files & accountability","Law & rights","Institutional accountability","contested",82,89,62],
  ["federal-debt","Federal debt & deficit","Economy","Fiscal policy","structural",95,97,73],
  ["ukraine-russia","Ukraine-Russia war","Geopolitics","War & settlement","escalating",94,91,83],
  ["israel-gaza","Israel-Gaza / regional settlement","Geopolitics","Regional security","escalating",94,93,85],
  ["china-taiwan","China-Taiwan strategic competition","Geopolitics","Strategic competition","structural",93,95,79],
  ["tariffs-trade","Tariffs & trade architecture","Economy","Trade policy","transitional",84,87,91],
  ["social-security","Social Security solvency","Economy","Social insurance","structural",92,96,70],
  ["medicaid-financing","Medicaid & healthcare financing","Economy","Healthcare financing","structural",89,91,78],
  ["ai-governance","AI regulation & governance","Technology","AI policy","transitional",88,90,94],
  ["government-restructuring","Federal government restructuring","Governance","Executive branch","transitional",86,84,90],
  ["abortion-policy","Abortion policy","Law & rights","Reproductive rights","contested",91,91,75],
  ["housing","Housing affordability & supply","Economy","Housing","structural",93,94,82],
  ["election-rules","Election rules & administration","Governance","Democracy","contested",88,90,80],
  ["law-enforcement-independence","DOJ, FBI & law-enforcement independence","Governance","Institutions","contested",87,88,84],
  ["energy-grid","Energy, grid & electricity","Economy","Infrastructure","structural",86,91,89],
  ["fertility","Fertility & population growth","Society","Demography","structural",80,93,67],
  ["big-tech","Big Tech, competition & antitrust","Technology","Market power","contested",82,86,81]
];

// Editorial baseline only: no factual assertions are published until evidence records are added.
export const topics = seeds.map(([id,title,domain,subtopic,status,priority,unresolved,change]) => ({
  id, countryId:"us", title, domain, subtopic, status, priority, signals:{activity:priority, unresolved, likelyChange:change},
  editorialBaseline:true, evidenceIds:[], eventIds:[], positionIds:[], resolutionIds:[], forecastIds:[`${id}-baseline`], history:[],
  facts:{summary:"Editorial baseline: evidence has not yet been added. This entry makes no current factual claim.", sourceRequired:true},
  interpretation:{summary:"Editorial baseline: competing explanations, constraints, and positions remain to be documented."},
  definitionOfResolved:"A documented, durable outcome meets stated legal, institutional, and practical criteria, with credible evidence and no material unresolved implementation question."
}));
