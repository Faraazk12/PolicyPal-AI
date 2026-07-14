// Policy knowledge base: sample text, Q&A intents, insights, and quick questions
// for each policy type. Extracted from the original prototype so the app logic
// can stay simple/local (no backend) while still being easy to extend.

export const DB = {
  health: {
    name: "Health Insurance",
    coverage: "87%",
    sample: `HEALTH INSURANCE POLICY — HLT-2024-00192
Valid: 01 Jan 2024 – 31 Dec 2024

SECTION 1 – COVERAGE
Covers hospitalisation, day-care procedures, pre-hospitalisation (30 days) & post-hospitalisation (60 days), ambulance up to ₹2,000, and domiciliary treatment.

SECTION 2 – EXCLUSIONS
Pre-existing conditions excluded for 24 months. No cosmetic surgery, dental (unless accidental), maternity, or self-inflicted injuries.

SECTION 3 – CLAIMS
Notify within 30 days of discharge. Submit bills, discharge summary & claim form. Cashless at network hospitals.

SECTION 4 – PREMIUM
Annual premium: ₹12,500. Grace period: 30 days. Late penalty: 2%/month. Lapses after 90 days.`,
    insights: [
      ["g", "✅ Policy active & valid"],
      ["y", "⏰ Renewal due in 45 days"],
      ["g", "📋 No pending claims"],
      ["r", "⚠️ Pre-existing: 24-month wait"],
    ],
    questions: [
      "What does my health policy cover?",
      "What are the exclusions?",
      "How do I file a claim?",
      "What is the grace period?",
      "Is dental treatment covered?",
    ],
    kw: {
      coverage: ["cover", "includ", "hospitali", "surgery", "ambulance", "benefit", "protect", "treatment"],
      exclusion: ["exclud", "not cover", "exclusion", "dental", "cosmetic", "maternity", "pre-existing", "self"],
      claim: ["claim", "file", "submit", "cashless", "discharge", "reimburse", "process", "bills"],
      premium: ["premium", "pay", "cost", "annual", "fee", "amount", "price"],
      deductible: ["deductible", "co-pay", "copay", "out of pocket", "excess"],
      dental: ["dental", "teeth", "tooth", "root canal"],
      grace: ["grace", "late", "overdue", "lapse", "miss payment"],
      ambulance: ["ambulance", "emergency transport"],
    },
    res: {
      coverage: {
        a: "Your <span class='term'>Health Insurance</span> covers:<br>• Hospitalisation expenses & surgeries<br>• Day-care procedures<br>• Pre-hospitalisation (30 days) & post-hospitalisation (60 days)<br>• Ambulance charges up to <strong>₹2,000</strong><br>• Domiciliary treatment by licensed physician",
        sec: "Section 1 – Coverage",
        ex: "Covers hospitalisation, day-care, pre/post-hospitalisation, ambulance up to ₹2,000, and domiciliary treatment.",
        c: 95,
      },
      exclusion: {
        a: "Your policy does <strong>NOT</strong> cover:<br>• Pre-existing conditions (<strong>first 24 months</strong>)<br>• Cosmetic or plastic surgery<br>• Dental (unless accidental)<br>• Maternity expenses<br>• Self-inflicted injuries<br>• Alcoholism/drug abuse",
        sec: "Section 2 – Exclusions",
        ex: "Pre-existing conditions excluded for 24 months. No cosmetic surgery, dental (unless accidental), or maternity.",
        c: 92,
      },
      claim: {
        a: "To file a <span class='term'>claim</span>:<br>1. Notify insurer <strong>within 30 days</strong> of discharge<br>2. Submit original bills, discharge summary & claim form<br>3. For <span class='term'>cashless</span> treatment — use a network hospital & pre-authorise",
        sec: "Section 3 – Claims",
        ex: "Notify within 30 days of discharge. Submit bills, discharge summary & claim form. Cashless at network hospitals.",
        c: 97,
      },
      premium: {
        a: "<span class='term'>Annual premium</span>: <strong>₹12,500</strong><br>• Grace period: <strong>30 days</strong> after due date<br>• Late payment: 2% penalty/month<br>• Policy lapses after <strong>90 days</strong> unpaid",
        sec: "Section 4 – Premium",
        ex: "Annual premium: ₹12,500. Grace period: 30 days. Late penalty: 2%/month. Lapses after 90 days.",
        c: 93,
      },
      deductible: {
        a: "Your policy has a <span class='term'>co-payment</span> of <strong>10%</strong> on claims above ₹1 lakh. If your bill is ₹2,00,000 — you pay ₹20,000 and insurance covers ₹1,80,000.",
        sec: "Section 1 – Coverage",
        ex: "Co-payment and deductible clauses apply as per policy schedule.",
        c: 78,
      },
      dental: {
        a: "<span class='term'>Dental treatment</span> is <strong>excluded</strong> unless caused by an accident. Routine check-ups, fillings, and root canals are not covered.",
        sec: "Section 2 – Exclusions",
        ex: "Dental treatment (unless accidental) is an exclusion under this policy.",
        c: 90,
      },
      grace: {
        a: "You have a <span class='term'>grace period</span> of <strong>30 days</strong> after your due date. After that, a 2%/month penalty applies. The policy lapses entirely after <strong>90 days</strong> without payment.",
        sec: "Section 4 – Premium",
        ex: "Grace period: 30 days post due date. Late penalty: 2%/month. Lapses after 90 days.",
        c: 95,
      },
      ambulance: {
        a: "<span class='term'>Ambulance charges</span> are covered up to <strong>₹2,000 per incident</strong> for emergency hospitalisation transport.",
        sec: "Section 1 – Coverage",
        ex: "Ambulance charges up to ₹2,000 per incident are covered.",
        c: 96,
      },
    },
  },

  motor: {
    name: "Motor Insurance",
    coverage: "82%",
    sample: `MOTOR INSURANCE POLICY — MTR-2024-00541
Vehicle: MH02-AB-1234 | Valid: 15 Mar 2024 – 14 Mar 2025

SECTION 1 – COVERAGE
Covers accidental damage, theft & total loss, third-party damage up to ₹7.5 lakh, personal accident ₹15 lakh (owner-driver), and natural calamities.

SECTION 2 – EXCLUSIONS
Excludes: drunk driving, unlicensed driver, mechanical breakdown, wear & tear, damage outside India, commercial misuse.

SECTION 3 – CLAIMS
File FIR. Notify insurer within 48 hours. Do not repair before inspection. Submit: FIR, licence, RC book, repair estimate.

SECTION 4 – PREMIUM & IDV
IDV: ₹6,20,000. Zero-depreciation add-on available. NCB: 20% on renewal if no claims filed.`,
    insights: [
      ["g", "✅ Motor policy active"],
      ["g", "🔄 NCB 20% on renewal"],
      ["g", "🚗 Vehicle: MH02-AB-1234"],
      ["r", "⚠️ No cover: unlicensed driver"],
    ],
    questions: [
      "What does motor insurance cover?",
      "What is IDV?",
      "How to claim after accident?",
      "What is No Claim Bonus?",
      "Is theft covered?",
    ],
    kw: {
      coverage: ["cover", "includ", "accident", "third-party", "natural", "flood", "earthquake", "protect", "benefit"],
      exclusion: ["exclud", "not cover", "drunk", "alcohol", "unlicensed", "licence", "breakdown", "commercial", "wear"],
      claim: ["claim", "accident", "fir", "police", "repair", "damage", "submit", "48 hour"],
      premium: ["premium", "cost", "price", "pay", "amount", "fee", "renewal", "idv"],
      idv: ["idv", "insured declared", "market value", "vehicle value"],
      ncb: ["ncb", "no claim", "bonus", "discount", "claim free", "reward"],
      theft: ["theft", "stolen", "steal", "missing", "total loss", "robbery"],
    },
    res: {
      coverage: {
        a: "Your <span class='term'>Motor Insurance</span> covers:<br>• Accidental damage to your vehicle<br>• Theft & total loss<br>• Third-party property damage up to <strong>₹7.5 lakh</strong><br>• Personal accident: <strong>₹15 lakh</strong> (owner-driver)<br>• Natural calamities (floods, earthquakes, cyclones)",
        sec: "Section 1 – Coverage",
        ex: "Covers accidental damage, theft, third-party up to ₹7.5 lakh, PA cover ₹15 lakh, and natural calamities.",
        c: 94,
      },
      exclusion: {
        a: "Your motor policy does <strong>NOT</strong> cover:<br>• <span class='term'>Drunk driving</span> or drugs<br>• Unlicensed driver<br>• Mechanical/electrical breakdown<br>• Normal wear & tear<br>• Damage outside India<br>• Commercial misuse",
        sec: "Section 2 – Exclusions",
        ex: "Excludes drunk driving, unlicensed driver, mechanical breakdown, wear & tear, and commercial misuse.",
        c: 91,
      },
      claim: {
        a: "After an accident:<br>1. <strong>File FIR</strong> with local police<br>2. Notify insurer within <strong>48 hours</strong><br>3. Do <strong>NOT</strong> repair before insurer inspection<br>4. Submit: FIR copy, driving licence, RC book, repair estimate",
        sec: "Section 3 – Claims",
        ex: "File FIR, notify insurer within 48 hours, do not repair before inspection. Submit FIR, licence, RC, estimate.",
        c: 96,
      },
      premium: {
        a: "Premium is based on <span class='term'>IDV</span> of <strong>₹6,20,000</strong>. Zero-depreciation add-on available. Earn <strong>20% NCB</strong> on renewal if no claims were made.",
        sec: "Section 4 – Premium & IDV",
        ex: "IDV: ₹6,20,000. Zero-depreciation available. NCB: 20% on renewal if no claims.",
        c: 90,
      },
      idv: {
        a: "<span class='term'>IDV (Insured Declared Value)</span> is your vehicle's current market value — the max payout if stolen or totalled. Your IDV is <strong>₹6,20,000</strong>. It reduces each year with depreciation.",
        sec: "Section 4 – Premium & IDV",
        ex: "Annual premium based on Insured Declared Value (IDV) of ₹6,20,000.",
        c: 88,
      },
      ncb: {
        a: "<span class='term'>NCB (No Claim Bonus)</span> gives you a <strong>20% discount</strong> on next year's premium for being claim-free. It can accumulate up to 50% over 5 years. Any claim resets it to 0.",
        sec: "Section 4 – Premium & IDV",
        ex: "NCB of 20% applicable on renewal if no claims were made this year.",
        c: 93,
      },
      theft: {
        a: "Yes — <span class='term'>theft and total loss</span> is covered. On theft:<br>1. File FIR immediately<br>2. Notify insurer within <strong>48 hours</strong><br>3. Submit: FIR, RC book, all keys, NOC from financier<br>Payout = IDV (<strong>₹6,20,000</strong>) after deductions.",
        sec: "Section 1 – Coverage",
        ex: "Covers theft and total loss of the insured vehicle as per IDV.",
        c: 92,
      },
    },
  },

  home: {
    name: "Home Insurance",
    coverage: "79%",
    sample: `HOME INSURANCE POLICY — HME-2024-00087
Property: 12B, Sector 4, New Delhi | Valid: 01 Apr 2024 – 31 Mar 2025

SECTION 1 – COVERAGE
Covers structure damage from fire, lightning, explosion, earthquake. Burglary/theft of contents up to ₹5 lakh. Flood & storm damage. Accidental glass & sanitary fitting damage.

SECTION 2 – EXCLUSIONS
Excludes: negligence, war/terrorism, wear & tear, unlisted electronics, property vacant >60 days.

SECTION 3 – CLAIMS
Theft: file FIR. Fire: call fire dept + insurer simultaneously. Photograph damage before repairs. Submit claim within 15 days with two repair estimates.

SECTION 4 – PREMIUM
Annual: ₹8,200. Structure insured: ₹45 lakh. Contents: ₹5 lakh. Add-ons for jewellery, electronics, artwork available.`,
    insights: [
      ["g", "✅ Home policy active"],
      ["g", "🏠 Structure: ₹45 lakh"],
      ["g", "📦 Contents: ₹5 lakh"],
      ["r", "⚠️ Vacant >60 days = cover void"],
    ],
    questions: [
      "What does home insurance cover?",
      "Is burglary covered?",
      "What if my house is empty?",
      "How to claim for fire damage?",
      "What is not covered?",
    ],
    kw: {
      coverage: ["cover", "includ", "fire", "flood", "earthquake", "protect", "benefit", "lightning", "storm"],
      exclusion: ["exclud", "not cover", "wear", "negligence", "war", "terror", "maintenance", "vacant"],
      claim: ["claim", "fire", "damage", "submit", "process", "photograph", "repair", "15 day"],
      theft: ["theft", "burglary", "stolen", "robber", "break in", "steal"],
      vacant: ["vacant", "empty", "unoccupy", "leave", "away", "60 days", "abandon"],
      premium: ["premium", "cost", "price", "pay", "annual", "amount", "insured value"],
    },
    res: {
      coverage: {
        a: "Your <span class='term'>Home Insurance</span> covers:<br>• Structure damage: fire, lightning, explosion, earthquake<br>• Burglary/theft of contents up to <strong>₹5 lakh</strong><br>• Flood & storm damage<br>• Accidental glass & sanitary fitting damage",
        sec: "Section 1 – Coverage",
        ex: "Covers structure damage from fire/earthquake, burglary/theft up to ₹5 lakh, and flood/storm damage.",
        c: 93,
      },
      exclusion: {
        a: "Your home policy does <strong>NOT</strong> cover:<br>• <span class='term'>Negligence</span> or poor maintenance<br>• War or terrorist activities<br>• Normal wear & tear<br>• Unlisted electronics<br>• Property vacant > <strong>60 consecutive days</strong>",
        sec: "Section 2 – Exclusions",
        ex: "Excludes negligence, war/terrorism, wear & tear, unlisted electronics, or property vacant >60 days.",
        c: 91,
      },
      claim: {
        a: "For <span class='term'>fire damage</span>:<br>1. Call fire dept & insurer <strong>simultaneously</strong><br>2. <strong>Photograph all damage</strong> before repairs<br>3. Submit claim within <strong>15 days</strong><br>4. Provide two repair estimates<br><br>For theft: file FIR first, then notify insurer.",
        sec: "Section 3 – Claims",
        ex: "For fire: contact fire dept and insurer simultaneously. Photograph damage before repairs. Claim within 15 days.",
        c: 95,
      },
      theft: {
        a: "Yes — <span class='term'>burglary & theft</span> of contents is covered up to <strong>₹5 lakh</strong>:<br>1. File <strong>police FIR</strong> immediately<br>2. List stolen items with values<br>3. Submit claim within 15 days<br><em>Note: Jewellery/electronics need separate listing.</em>",
        sec: "Section 1 – Coverage",
        ex: "Burglary and theft of household contents up to ₹5 lakh is covered.",
        c: 92,
      },
      vacant: {
        a: "⚠️ If your property is <strong>vacant for more than 60 consecutive days</strong>, your coverage becomes <span class='term'>void</span>. All claims during that period will be rejected. Inform your insurer if you plan an extended absence.",
        sec: "Section 2 – Exclusions",
        ex: "Any damage when property is left unoccupied for more than 60 days is not covered.",
        c: 97,
      },
      premium: {
        a: "<span class='term'>Annual premium</span>: <strong>₹8,200</strong><br>• Structure insured: <strong>₹45 lakh</strong><br>• Contents covered: <strong>₹5 lakh</strong><br>• Add-ons for jewellery, electronics & artwork available",
        sec: "Section 4 – Premium",
        ex: "Annual: ₹8,200. Structure: ₹45 lakh. Contents: ₹5 lakh. Add-ons available.",
        c: 94,
      },
    },
  },

  life: {
    name: "Life Insurance",
    coverage: "91%",
    sample: `LIFE INSURANCE POLICY — LFE-2024-01234
Term: 20 Years | Valid: 01 Jan 2024 – 31 Dec 2043

SECTION 1 – COVERAGE
Sum Assured: ₹50,00,000 to nominee on death. ADB rider: +₹25 lakh on accidental death. Critical Illness rider: 36 illnesses, lump-sum payout.

SECTION 2 – EXCLUSIONS
Suicide within 12 months. Death under alcohol/drugs. Hazardous activities (without rider). War or criminal activity.

SECTION 3 – CLAIMS
Nominee notifies within 90 days of death. Submit: policy doc, death certificate, nominee ID, claim form. Settlement within 30 days via NEFT.

SECTION 4 – PREMIUM & MATURITY
Annual: ₹18,500 | Monthly: ₹1,650 (+3% loading). Term: 20 years. Maturity benefit: 110% of total premiums paid on survival.`,
    insights: [
      ["g", "✅ Life policy — 20 year term"],
      ["g", "👤 Nominee registered"],
      ["g", "💰 Sum assured: ₹50 lakh"],
      ["r", "⚠️ Suicide exclusion: first 12 months"],
    ],
    questions: [
      "What is the sum assured?",
      "Who gets the money if I die?",
      "What is maturity benefit?",
      "How to file a death claim?",
      "What are the exclusions?",
    ],
    kw: {
      coverage: ["cover", "sum assured", "includ", "protect", "critical", "accidental", "rider", "death benefit"],
      exclusion: ["exclud", "not cover", "suicide", "alcohol", "drugs", "war", "hazardous", "criminal"],
      claim: ["claim", "death", "nominee", "file", "submit", "document", "certificate", "settle", "90 days"],
      premium: ["premium", "cost", "price", "pay", "annual", "monthly", "amount", "fee"],
      maturity: ["maturity", "maturity benefit", "survive", "return", "end of term", "20 year", "after term"],
      nominee: ["nominee", "beneficiary", "who gets", "family", "dependent", "change nominee"],
    },
    res: {
      coverage: {
        a: "Your <span class='term'>Life Insurance</span> provides:<br>• Sum Assured: <strong>₹50,00,000</strong> to nominee on death<br>• <span class='term'>ADB Rider</span>: Additional <strong>₹25 lakh</strong> on accidental death<br>• <span class='term'>Critical Illness Rider</span>: Covers 36 illnesses with lump-sum payout<br>• Policy term: <strong>20 years</strong>",
        sec: "Section 1 – Coverage",
        ex: "Sum Assured ₹50 lakh to nominee on death. ADB rider: +₹25 lakh. Critical illness: 36 conditions.",
        c: 96,
      },
      exclusion: {
        a: "Your life policy does <strong>NOT</strong> cover death due to:<br>• <span class='term'>Suicide</span> within first <strong>12 months</strong><br>• Alcohol or drug influence<br>• Hazardous activities (without rider)<br>• War or criminal activity",
        sec: "Section 2 – Exclusions",
        ex: "Excludes suicide (first 12 months), alcohol/drugs, hazardous activities without rider, and war.",
        c: 90,
      },
      claim: {
        a: "The <span class='term'>nominee</span> must:<br>1. Notify insurer within <strong>90 days</strong> of death<br>2. Submit: policy doc, death certificate, nominee ID, claim form<br>3. Insurer settles within <strong>30 days</strong> via NEFT to nominee's bank account",
        sec: "Section 3 – Claims",
        ex: "Nominee notifies within 90 days. Settlement within 30 days via NEFT after all documents received.",
        c: 95,
      },
      premium: {
        a: "<span class='term'>Premium options</span>:<br>• Annual: <strong>₹18,500/year</strong><br>• Monthly: <strong>₹1,650/month</strong> (+3% loading)<br>• Payment term: 20 years<br>• <span class='term'>Maturity benefit</span>: 110% of total premiums paid",
        sec: "Section 4 – Premium & Maturity",
        ex: "Annual: ₹18,500. Monthly: ₹1,650 (+3% loading). Maturity: 110% of premiums on survival.",
        c: 93,
      },
      maturity: {
        a: "🎉 <span class='term'>Maturity Benefit</span>: If you survive the full <strong>20-year term</strong>, you receive <strong>110% of all premiums paid</strong>.<br><br>Example: ₹18,500 × 20 = ₹3,70,000 paid → You receive <strong>₹4,07,000</strong> on maturity.",
        sec: "Section 4 – Premium & Maturity",
        ex: "On maturity (survival after 20 years), 110% of total premiums paid is returned as maturity benefit.",
        c: 94,
      },
      nominee: {
        a: "Your <span class='term'>nominee</span> receives the <strong>₹50 lakh</strong> Sum Assured on your death. To update nominee details, submit: nominee name, relationship, DOB & Aadhaar to your insurer. Always keep nominee info current!",
        sec: "Section 1 – Coverage",
        ex: "Sum Assured of ₹50 lakh is payable to the registered nominee on death of the policyholder.",
        c: 88,
      },
    },
  },
};

export const GLOSSARY = {
  deductible: "Amount you pay before insurance starts.",
  premium: "Regular payment to keep your policy active.",
  exclusion: "Events your policy does NOT cover.",
  copay: "Fixed amount you pay; insurer covers the rest.",
  idv: "Insured Declared Value — current market value of your vehicle.",
  ncb: "No Claim Bonus — discount on renewal if no claims were made.",
  grace: "Extra time after due date to pay without losing coverage.",
  cashless: "Insurer pays hospital directly; no upfront payment from you.",
  nominee: "Person designated to receive your insurance benefits.",
  rider: "Optional add-on to your base insurance policy.",
};

export const POLICY_TYPES = [
  { value: "health", label: "🏥 Health Insurance" },
  { value: "motor", label: "🚗 Motor Insurance" },
  { value: "home", label: "🏠 Home Insurance" },
  { value: "life", label: "❤️ Life Insurance" },
];
