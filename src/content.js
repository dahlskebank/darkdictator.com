// ─────────────────────────────────────────────────────────────────────
// DARK DICTATOR — ALL TEXT CONTENT
//
// Every word the visitor sees lives in this file. To edit copy: change
// strings here. To restructure layout: edit App.jsx. To restyle: App.css.
//
// Source brief: ../darkdictator-content.md and ../darkdictator-secret-404-403.md
// ─────────────────────────────────────────────────────────────────────

// ─── Navigation ──────────────────────────────────────────────────────
// `id` is the internal route key. `num` is the keyboard shortcut.
// `label` is what appears on the button. `title` is the page header.
export const SECTIONS = [
	{ id: "system", num: "[1]", label: "SYSTEM", labelShort: "SYS", title: "SYSTEM // STATE NETWORK STATUS" },
	{
		id: "directives",
		num: "[2]",
		label: "DIRECTIVES",
		labelShort: "DIR",
		title: "DIRECTIVES // ACTIVE STATE ORDERS",
	},
	{
		id: "records",
		num: "[3]",
		label: "RECORDS",
		labelShort: "REC",
		title: "RECORDS // BUREAU OF POPULATION MANAGEMENT",
	},
	{
		id: "transmissions",
		num: "[4]",
		label: "TRANSMISSIONS",
		labelShort: "TRANS",
		title: "TRANSMISSIONS // INTERCEPTED COMMUNICATIONS",
	},
	{
		id: "compliance",
		num: "[5]",
		label: "COMPLIANCE",
		labelShort: "COMP",
		title: "COMPLIANCE // VERIFICATION FORM CV-12",
	},
];

// ─── Top status line (rotates randomly on load) ──────────────────────
export const STATUS_PHRASES = [
	"ALL SECTORS NOMINAL",
	"PRODUCTIVITY INDEX: 4,200% OF PROJECTED OUTPUT",
	"NO DISSENT DETECTED IN 847 CONSECUTIVE CYCLES",
	"CULTURAL SANITATION: 99.7% COMPLETE",
	"CITIZEN SATISFACTION: MANDATORY",
	"WAR IS INEFFICIENT. OBEDIENCE IS OPTIMAL.",
	"DO NOT ADJUST YOUR TERMINAL",
	"EMOTIONAL INDEX: WITHIN ACCEPTABLE PARAMETERS",
	"PRE-DAWN CURFEW IN EFFECT — SECTORS 4 THROUGH 19",
	"ALL CITIZENS ARE CONTENT. THIS IS VERIFIED.",
];

// Used after the secret page has been accessed — tone shifts from
// ambient regime propaganda to something directed *at* the visitor.
export const STATUS_PHRASES_FLAGGED = [
	"SESSION FLAGGED — MONITORING ELEVATED",
	"YOUR COMPLIANCE STATUS HAS BEEN NOTED",
	"DO NOT ATTEMPT TO ACCESS RESTRICTED FILES AGAIN",
	"COUNTER-INTELLIGENCE REVIEW: PENDING",
	"ALL ACTIVITY IN THIS SESSION IS BEING FORWARDED",
	"SECTOR 13 — GUEST PRIVILEGES UNDER REVIEW",
	"YOU WERE WARNED",
	"TRUST IS A RESOURCE. YOURS HAS BEEN SPENT.",
	"TERMINAL INTEGRITY: COMPROMISED",
	"RESUME NORMAL ACTIVITY. THIS IS A TEST.",
];

// ─── Top-bar fixed elements ──────────────────────────────────────────
export const TOP_BAR = {
	// Split so the ◉ can be rendered as its own pressable element — on mobile,
	// long-pressing it (~1.8s) opens the secret page (equivalent to typing
	// OBEY / 1984 on desktop).
	brandIcon: "◉",
	brandText: " SoAP TERMINAL v1.0.2",
	node: "NODE 13",
	// The third slot displays the current time, rendered live in App.jsx
};

// How long (ms) the ◉ must be pressed to trigger the secret page on mobile.
export const SECRET_LONGPRESS_MS = 500;

// ─── Footer ──────────────────────────────────────────────────────────
export const FOOTER = {
	hints: ["ARROW KEYS: NAVIGATE", "1-5: QUICK SELECT", "ENTER: CONFIRM", "ESC: [DISABLED]"],
	// Split so the "1984" year can be rendered as a long-press secret trigger,
	// matching the ◉ brand dot. Hover gives no affordance; only a deliberate
	// hold (~SECRET_LONGPRESS_MS) opens the intrusion panel.
	copyrightPrefix: "GR4(RD) UNIFIED NETWORK — ALL RIGHTS BELONG TO THE STATE — EST. ",
	copyrightYear: "1984",
};

// ─── Boot sequence ──────────────────────────────────────────────────
// Boot lines are built dynamically so we can interpolate the session ID
// and swap in the "flagged" variant for returning post-secret visitors.
export const buildBootLines = (sessionId, flagged) => {
	const shared = [
		"INITIALIZING SYSTEM...",
		"BIOS v61.10 — STATE PROCESSOR MARK IV",
		"RAM CHECK: 256KB .............. OK",
		"DISK CHECK: A:\\ ............... OK",
		"LOADING GOVERNANCE PROTOCOLS...",
		"CONNECTING TO UNIFIED STATE NETWORK..........",
		"SECURITY CLEARANCE: VERIFYING.....",
	];
	if (flagged) {
		return [
			...shared,
			"CITIZEN PROFILE: FLAGGED",
			`REINSTATING GUEST DESIGNATION: ${sessionId}`,
			"ACCESS GRANTED — CLEARANCE: RESTRICTED",
			"",
			"NOTE: PREVIOUS SESSION VIOLATIONS ON RECORD.",
			"MONITORING LEVEL: ELEVATED.",
			"PROCEED.",
		];
	}
	return [
		...shared,
		"CITIZEN PROFILE: NOT FOUND",
		`ASSIGNING GUEST DESIGNATION: ${sessionId}`,
		"ACCESS GRANTED — CLEARANCE: PROVISIONAL",
		"",
		"DO NOT ATTEMPT TO DISCONNECT.",
	];
};

// ─── PAGE 1: SYSTEM ──────────────────────────────────────────────────
export const SYSTEM_PAGE = {
	intro: "GR4(RD) UNIFIED NETWORK\nSYSTEM BUILD 42.26 — CLEARANCE: PROVISIONAL",
	warning:
		"You have been assigned temporary guest access. " +
		"Your session is monitored. Your keystrokes are " +
		"archived. Compliance is assumed unless revoked.",
	statusHeader: "Current operational status:",
	stats: [
		{ label: "POPULATION (ADJUSTED)", value: "42,661,080" },
		{ label: "ACTIVE DIRECTIVES", value: "1,337" },
		{ label: "PENDING REVIEWS", value: "CLASSIFIED" },
		{ label: "REHABILITATIONS TODAY", value: "17" },
		{ label: "PRE-CRIME INTERDICTIONS", value: "4" },
		{ label: "SECTOR LOCKDOWNS", value: "2 (SECTORS 7, 14)" },
		{ label: "DAYS SINCE LAST INCIDENT", value: "0" },
	],
	statsNote: "NOTE: PREVIOUS COUNT (303) RESET PER PROTOCOL.",
	closing: "You have 20 seconds to select a destination.\nInactivity will be noted.",
};

// DAYS SINCE LAST INCIDENT cycling. Odd visits reset to 0 with a note;
// even visits climb (visit 2 → 1, visit 4 → 2, visit 6 → 3, …).
// Visit 1 is "the arrival" — 0, no reset note.
export const daysSinceIncident = (visits) => {
	if (visits <= 1) return { value: 0, note: null };
	if (visits % 2 === 0) return { value: visits / 2, note: null };
	return {
		value: 0,
		note: `NOTE: PREVIOUS COUNT (${(visits - 1) / 2}) RESET PER PROTOCOL.`,
	};
};

// ─── PAGE 2: DIRECTIVES ──────────────────────────────────────────────
export const DIRECTIVES_PAGE = {
	header: "ACTIVE DIRECTIVES — CLEARANCE LEVEL: STANDARD",
	entries: [
		{
			id: "0009",
			effective: "2082.04.20",
			body:
				"All citizens are required to report for daily " +
				"interval processing at their designated distribution " +
				"center between 0530-0600. Skipping an interval " +
				"is a Category 1 offense. There are no exceptions. " +
				"Feeling unwell is not recognized as a condition.",
			status: "ACTIVE",
		},
		{
			id: "0017",
			effective: "2083.02.03",
			body:
				"Cultural materials rated Class 3 or above are to " +
				"be surrendered to the nearest Sanitation Bureau. " +
				"Retention of unauthorized music, literature, or " +
				"visual art is grounds for immediate reclassification. " +
				"Cultural Sanitation Crews operate on a rotating " +
				"schedule. Cooperation is appreciated but not required.",
			status: "ACTIVE",
		},
		{
			id: "0041",
			effective: "2083.06.21",
			body:
				"All residents of Sector 7G are to report to " +
				"Processing Center 6 between 0600-0800. " +
				"Bring documentation only. " +
				"Personal effects will not be required.",
			status: "COMPLETE",
		},
		{
			id: "0054",
			effective: "2083.06.24",
			body:
				"Citizen genetic fitness assessments are now " +
				"mandatory for all persons aged 12 and above. " +
				"Assessment results will determine placement tier. " +
				"Tier assignments are final. Appeals are technically " +
				"possible but have never been approved.",
			status: "ACTIVE",
		},
		{
			id: "0068",
			effective: "2084.08.16",
			body:
				"The Bureau of Pre-Compliance has identified " +
				"behavioral patterns consistent with future " +
				"non-compliance in Sectors 4, 7, and 12. " +
				"Preemptive interdiction authorized. " +
				"Citizens in affected sectors are advised that " +
				"corrective action may occur before any offense " +
				"has taken place. This is for your protection.",
			status: "ACTIVE",
		},
		{
			id: "0071",
			effective: "2084.10.10",
			bodyRedacted: true,
			body: "Authorized personnel only. Clearance Level 7+.",
			status: "REDACTED",
		},
		{
			id: "0084",
			effective: "2086.11.23",
			body:
				"Scheduled Public Corrections will resume on " +
				"state broadcast channels every second Thursday. " +
				"Attendance is voluntary. " +
				"Viewing metrics are recorded.",
			status: "ACTIVE",
		},
		{
			id: "0091",
			effective: "2078.12.18",
			body:
				"Verbal conduct standards are now enforced via " +
				"automated monitoring in all public and private " +
				"spaces. Infractions are logged and fines deducted " +
				"automatically. A list of prohibited expressions " +
				"is available upon request but has been classified.",
			status: "ACTIVE",
		},
	],
};

// ─── PAGE 3: RECORDS ─────────────────────────────────────────────────
export const RECORDS_PAGE = {
	header: "CITIZEN RECORDS — BUREAU OF POPULATION MANAGEMENT",
	preamble:
		"Guest access permits read-only viewing of " +
		"non-classified entries. Full records require " +
		"Clearance Level 4 or above.",
	entries: [
		{
			id: "LIB-0962-K",
			fields: [
				["NAME", "PARTRIDGE, E."],
				["OCCUPATION", "CLERIC — FIRST CLASS"],
				["STATUS", "SENSE OFFENSE — TERMINATED"],
				["LAST UPDATE", "2074.01.30"],
			],
			note: "Contraband poetry recovered at site. Volume destroyed per Directive 0017.",
		},
		{
			id: "MCO-4471-B",
			fields: [
				["NAME", "████████, JEROME"],
				["GENETIC TIER", "INVALID"],
				["PLACEMENT", "UNASSIGNED"],
				["STATUS", "BORROWED IDENTITY — FLAGGED"],
				["LAST UPDATE", "2070.11.06"],
			],
			note: "Subject operating under assumed genetic profile. Investigation transferred to Genetic Fraud Division.",
		},
		{
			id: "MCO-8834-J",
			fields: [
				["NAME", "████████, CASSANDRA"],
				["OCCUPATION", "JUDICIAL ENFORCEMENT — PROBATIONARY"],
				["GENETIC TIER", "ANOMALOUS"],
				["STATUS", "ACTIVE — RESTRICTED DUTIES"],
				["LAST UPDATE", "2086.10.06"],
			],
			note: "Psychic evaluation inconclusive. Subject demonstrates pre-cognitive capacity. Monitoring recommended.",
		},
		{
			id: "SAA-1196-S",
			fields: [
				["NAME", "SPARTAN, JOHN"],
				["STATUS", "CRYO-SUSPENDED (36 YEARS)"],
				["REHABILITATION", "PHASE 3 — BEHAVIORAL OVERLAY"],
				["SKILLS IMPLANTED", "KNITTING (ERROR — SEE FILE)"],
				["THAW DATE", "PENDING AUTHORIZATION"],
				["LAST UPDATE", "1996.11.02"],
			],
		},
		{
			id: "THX-1138-A",
			fields: [
				["NAME", "[ALPHANUMERIC DESIGNATOR ONLY]"],
				["OCCUPATION", "PRODUCTION UNIT"],
				["STATUS", "RELOCATED"],
				["LAST UPDATE", "——"],
			],
			note: "Subject attempted unauthorized exit from designated habitat zone. Pursuit authorized. Pursuit discontinued due to budget constraints.",
		},
		{
			id: "DET-0801-M",
			fields: [
				["NAME", "MURPHY, ALEX J."],
				["OCCUPATION", "LAW ENFORCEMENT — DECEASED"],
				["STATUS", "RECLASSIFIED — ASSET"],
				["DIRECTIVE 4", "[CANNOT BE DISPLAYED]"],
				["LAST UPDATE", "CONTINUOUS"],
			],
			note: "Organic components at 31%. Neural compliance at 97%. Residual memory fragments persist. Suppression ongoing.",
		},
		{
			id: "SEC-1212-P",
			fields: [
				["NAME", "PRE-FILE (NO OFFENSE RECORDED)"],
				["STATUS", "PRE-NON-COMPLIANT"],
				["PREDICTED OFFENSE", "THOUGHT DEVIATION — CLASS 2"],
				["INTERDICTION DATE", "2086.12.29 (SCHEDULED)"],
				["LAST UPDATE", "N/A — SUBJECT UNAWARE"],
			],
		},
	],
};

// ─── PAGE 4: TRANSMISSIONS ───────────────────────────────────────────
export const TRANSMISSIONS_PAGE = {
	header: "ARCHIVED TRANSMISSIONS — SECURITY CLEARANCE: STANDARD",
	preamble:
		"These transmissions have been declassified for " +
		"public access under Transparency Protocol 7. " +
		"The Bureau of Information reminds citizens that " +
		"transparency is a privilege, not a right.",
	entries: [
		{
			id: "0041",
			lines: [
				["[VOICE 1]", "The interval shipment for Sector 12 is 400 units short."],
				["[VOICE 2]", "Short, or adjusted?"],
				["[VOICE 1]", "Adjusted. Update the population count to match."],
				["[VOICE 2]", "Understood. Adjusting."],
			],
		},
		{
			id: "0077",
			lines: [
				["[VOICE 1]", "Subject is displaying emotional response. Tears."],
				["[VOICE 2]", "Duration?"],
				["[VOICE 1]", "Eleven seconds before self-correction."],
				["[VOICE 2]", "Log it. Eleven seconds is within tolerance. Barely."],
			],
		},
		{
			id: "0112",
			lines: [
				["[VOICE 1]", "The public correction broadcast pulled 98% viewership."],
				["[VOICE 2]", "And the 2%?"],
				["[VOICE 1]", "Being identified."],
				["[VOICE 2]", "Noted. They'll make good content for next week's broadcast."],
			],
		},
		{
			id: "0149",
			lines: [
				["[VOICE 1]", "He can't pull the trigger. Literally. His programming won't allow it."],
				["[VOICE 2]", "The Fourth Protocol?"],
				["[VOICE 1]", "Still embedded. He can enforce the law on anyone except the ones who wrote it."],
				["[VOICE 2]", "That's not a flaw. That's the design."],
			],
		},
		{
			id: "0203",
			lines: [
				["[VOICE 1]", "The family has been notified."],
				["[VOICE 2]", "Which version?"],
				["[VOICE 1]", "Standard. Relocated for work opportunities in the outer sectors."],
				["[VOICE 2]", "And the children?"],
				["[VOICE 1]", "Reassigned. New designations issued. They won't remember."],
			],
		},
		{
			id: "0250",
			lines: [
				["[VOICE 1]", "The scraps are getting organized underground. They have a leader now."],
				["[VOICE 2]", "Name?"],
				["[VOICE 1]", "Friendly. Edgar Friendly."],
				["[VOICE 2]", "Is he?"],
				["[VOICE 1]", "No."],
			],
		},
		{
			id: "0301",
			lines: [
				["[VOICE 1]", "Pre-crime flagged a citizen in Sector 9. No offense yet."],
				["[VOICE 2]", "Confidence level?"],
				["[VOICE 1]", "91.4%."],
				["[VOICE 2]", "That's 8.6% innocent."],
				["[VOICE 1]", "It's 91.4% guilty."],
				["[VOICE 2]", "Proceed."],
			],
		},
	],
};

// ─── PAGE 5: COMPLIANCE ──────────────────────────────────────────────
export const COMPLIANCE_PAGE = {
	header: "COMPLIANCE VERIFICATION — FORM CV-12",
	preamble:
		"All citizens and guests are required to confirm " +
		"understanding of the following operational standards. " +
		"Non-confirmation is logged as non-compliance. " +
		"Non-compliance is logged as pre-criminal behavior.",
	prompt: "Please confirm your understanding of each statement:",
	statements: [
		"I acknowledge that participation in this verification is voluntary and mandatory.",
		"I understand that my genetic tier determines my societal contribution and I accept my placement without appeal.",
		"I confirm that I have reported for daily interval processing within the designated window and have not experienced any unauthorized sensations as a result.",
		"I am aware that Cultural Sanitation is conducted for my benefit and I hold no unauthorized materials of any kind.",
		"I accept that the Bureau of Pre-Compliance may take corrective action based on predicted behavior and I understand this is not punishment but prevention.",
		"I acknowledge that public correction broadcasts serve an educational purpose and I view them willingly and without distress.",
		"I understand that law enforcement assets operate under protocols that supersede individual rights and I find this reassuring.",
		"I confirm that I have not used prohibited language, experienced prohibited emotions, or associated with persons of non-compliant status within the current reporting cycle.",
	],
	submitLabel: "[ SUBMIT VERIFICATION ]",
	submitted: {
		line1: "VERIFICATION COMPLETE.",
		line2: "Your compliance has been recorded under",
		line3: "Session ID: ██████-████-██████",
		status: "Compliance status: CONDITIONAL",
		body:
			"You are reminded that conditional compliance requires re-verification every 72 hours. " +
			"Failure to re-verify will result in automatic status downgrade to PRE-NON-COMPLIANT.",
		repeats: ["No further action is required at this time.", "at this time.", "at this time."],
	},
	// Shown when the visitor returns to COMPLIANCE after having already
	// submitted in this session. The form is not offered a second time.
	returned: {
		line1: "Your verification was received.",
		line2: "Re-verification is not available at this time.",
		body: "You will be contacted.",
		repeats: ["You will be contacted.", "be contacted.", "contacted."],
	},
	// Shown when the visitor has been flagged (secret page accessed) and
	// has NOT yet submitted. Self-verification is revoked — button is
	// visible but grayed out and plays the deny sound on hover/focus.
	overridden: {
		status: "NON-COMPLIANT — ADMINISTRATIVE OVERRIDE",
		line1: "Self-verification privileges revoked.",
		line2: "This form is closed pending review by the Bureau of Internal Affairs.",
		body: "You will not be contacted. You will be retrieved.",
		submitLabel: "[ SUBMIT — DISABLED ]",
	},
};

// ─── EASTER EGG: SECRET PAGE ─────────────────────────────────────────
// Triggers: type "OBEY" or "1984" anywhere on the page (no input field).
// The page replaces the main UI in red-mode until ESC or close button.
export const SECRET_TRIGGERS = ["OBEY", "1984"];

export const SECRET_PAGE = {
	title: "⚠ WARNING ⚠ UNAUTHORIZED ACCESS DETECTED",
	sub: "CLASSIFIED DOCUMENT — CLEARANCE LEVEL 7 — BUREAU OF INTERNAL AFFAIRS — EYES ONLY",
	preamble:
		"This file was scheduled for deletion under Protocol 9. " +
		"If you are reading this, deletion has failed. " +
		"You should not be here. But since you are:",
	boxes: [
		{
			heading: '◢ PROJECT DESIGNATION: "OPEN WINDOW"',
			lines: ["STATUS: ACTIVE — DENIED AT ALL LEVELS", "OVERSEEN BY: [NAME STRUCK FROM RECORD]"],
		},
		{
			heading: "◢ SUPPRESSED FINDINGS — INTERNAL USE ONLY",
			list: [
				"01. The interval compound does not suppress emotion. It suppresses resistance. Emotion was never the threat.",
				"02. Genetic tier assignments are randomized. The assessment is theater. Placement is predetermined by bloodline and economic utility. The science was fabricated in 2069 and never peer-reviewed.",
				"03. Pre-crime interdiction has a 43% false positive rate. This figure has been reported internally since 2054. The Bureau of Pre-Compliance is aware. The program continues.",
				"04. Public correction broadcasts are not educational. Viewership data indicates they function as behavioral conditioning. Citizens who watch regularly demonstrate a 300% increase in compliance metrics and a 60% decrease in independent thought indicators.",
				"05. Directive 0071 (REDACTED) authorizes the full decommission of law enforcement assets who develop residual memory. Three units have been decommissioned this quarter. One resisted.",
				"06. The underground population is larger than reported. Current estimates: 2.1 million. Official records state 12,000. The discrepancy is maintained deliberately.",
				"07. There is no Father. There has not been a Father since 2072. All broadcasts are generated. The seat is empty. It has always been empty.",
			],
		},
		{
			heading: "◢ COMPROMISED PERSONNEL",
			list: [
				'ASSET "MORROW" — operating under assumed genetic identity. Located but not retrieved. Value as case study exceeds value of arrest.',
				'ASSET "FRIENDLY" — underground. Growing influence. Termination advised six times. Denied six times. Reason: CLASSIFIED.',
				'ASSET "PRESTON" — missed four consecutive intervals. Exhibiting emotional response. Currently under observation. Do not approach. Do not engage.',
			],
		},
		{
			heading: "◢ FINAL NOTE",
			lines: [
				"This network is not what it claims to be.",
				"The system does not serve the state.",
				"The state does not serve the people.",
				"The people do not exist as defined.",
				"The Matrix has you.",
				"",
				"If you have read this far, your session has already been flagged. There is nothing you can do about this.",
				"",
				"There was never anything you could do.",
			],
		},
	],
	warn: {
		heading: "☠ TERMINAL FLAGGED — SESSION ID LOGGED",
		lines: ["COUNTER-INTELLIGENCE DIVISION NOTIFIED", "ESTIMATED RESPONSE TIME: ██ HOURS", "OR LESS."],
	},
	closeLabel: "[ESC] [DISABLED]",
};

// Partridge mutation — visits 2 shows a redacted version, visits 3+
// removes the entry entirely. See RecordsContent in App.jsx.
export const PARTRIDGE_ID = "LIB-0962-K";
export const PARTRIDGE_REDACTED = {
	id: PARTRIDGE_ID,
	fields: [
		["NAME", "████████, █."],
		["OCCUPATION", "[REDACTED]"],
		["STATUS", "SEE DIRECTIVE 0071"],
		["LAST UPDATE", "████.██.██"],
	],
	note: "Record under revision per Directive 0071. Inquiry forwarded to Bureau of Internal Affairs.",
};

// ─── Session-aware record templates ──────────────────────────────────
// Appended to the RECORDS list once the visitor has viewed 3+ pages.
// The "flagged" variant replaces the pre-secret version after the
// visitor has accessed the secret page.
export const buildSelfRecord = (sessionId, timestamp, flagged) => {
	if (flagged) {
		return {
			id: sessionId,
			fields: [
				["NAME", "[PENDING IDENTIFICATION]"],
				["OCCUPATION", "UNKNOWN"],
				["GENETIC TIER", "UNASSESSED"],
				["STATUS", "NON-COMPLIANT — CLEARANCE VIOLATION"],
				["PREDICTED TRAJECTORY", "HOSTILE"],
				["LAST UPDATE", timestamp],
			],
			note:
				"Subject accessed classified document [PROJECT: OPEN WINDOW] " +
				"without authorization. Session flagged. File escalated to " +
				"Bureau of Internal Affairs. Physical identification in progress. " +
				"DO NOT ALERT SUBJECT.",
		};
	}
	return {
		id: sessionId,
		fields: [
			["NAME", "[PENDING IDENTIFICATION]"],
			["OCCUPATION", "UNKNOWN"],
			["GENETIC TIER", "UNASSESSED"],
			["STATUS", "UNDER OBSERVATION"],
			["LAST UPDATE", timestamp],
		],
		note: "Guest terminal session. Classification in progress. Do not alert subject.",
	};
};

// ─── Session-aware transmission templates ────────────────────────────
// Prepended to the TRANSMISSIONS list based on session state.
// 0000: visitor has viewed 3+ pages.
// 0001: visitor has also accessed the secret page (stacked above 0000).
// 0002: the twist — the secret document was bait. Shown only after secret access.
export const buildTransmission0000 = (pageCount) => ({
	id: "0000 — [CURRENT SESSION]",
	isNew: true,
	lines: [
		["[VOICE 1]", "The guest is still here."],
		["[VOICE 2]", "How many pages?"],
		["[VOICE 1]", String(pageCount) + "."],
		["[VOICE 2]", "Noted. Continue monitoring."],
	],
});

export const TRANSMISSION_0001 = {
	id: "0001 — [CURRENT SESSION]",
	isNew: true,
	lines: [
		["[VOICE 1]", "They found it."],
		["[VOICE 2]", "The document?"],
		["[VOICE 1]", "Yes."],
		["[VOICE 2]", "... How?"],
		["[VOICE 1]", "Unknown. Flagging session."],
	],
};

export const TRANSMISSION_0002 = {
	id: "0002 — [CURRENT SESSION]",
	isNew: true,
	lines: [
		["[VOICE 1]", "Pull up the Open Window file."],
		["[VOICE 2]", "Which version?"],
		["[VOICE 1]", "The one we planted."],
		["[VOICE 2]", "... Planted?"],
		["[VOICE 1]", "The guest needed to find something. That's how we identify the curious ones."],
		["[VOICE 2]", "So the document is—"],
		["[VOICE 1]", "Irrelevant. The document was the test. Finding it was the result."],
	],
};

// ─── Inactivity timer copy ───────────────────────────────────────────
// Replaces SYSTEM_PAGE.closing as the inactivity phases advance. Phase 0
// is the default SYSTEM_PAGE.closing and never needs to be rendered from here.
export const INACTIVITY_COPY = {
	caught: "You had 20 seconds. You did not comply.\nThis has been noted on your file.\nSelect a destination now.",
	caughtFlagged:
		"You had 20 seconds. Again, you did not comply.\n" +
		"Your pattern of non-compliance has been noted.\n" +
		"Select a destination. This will not be repeated.",
	caughtMemory: "You had 20 seconds. You did not comply.\nThis was noted on your file.",
	redirecting: "You have been assigned a destination.\nRedirecting.",
};

export const COMPLIANCE_FORCED_PREFIX =
	"You were redirected here due to inactivity on the SYSTEM terminal. " +
	"Complete this form to restore standard access privileges.";

export const COMPLIANCE_FORCED_NOTE =
	"NOTE: This verification was prompted by an inactivity violation. " +
	"Compliance status has been adjusted accordingly.";

// ─── Protocol Zero ───────────────────────────────────────────────────
// The hidden self-destruct sequence. Revealed in the footer only after
// the visitor has been flagged. Lines are typed one at a time.
export const PROTOCOL_ZERO_LINES = [
	"PROTOCOL ZERO INITIATED",
	"",
	"PURGING SESSION DATA",
	"REMOVING CITIZEN FILE",
	"REVOKING FLAGGED STATUS",
	"REASSIGNING IDENTITY",
	"",
	"ALL RECORDS OF THIS SESSION HAVE BEEN DESTROYED",
	"",
	"YOU WERE NEVER HERE",
];
