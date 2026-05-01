// Session + persistent state for darkdictator.com.
// Plain module (no React context) — components call these helpers directly.
//
// sessionStorage: state for one visit only (page views, population tick, etc.)
// localStorage:   state that persists across visits (secretAccessed flag,
//                 persistent session ID for flagged visitors)

const POP_INITIAL = 42661080;

const hex = () => Math.floor(Math.random() * 16).toString(16).toUpperCase();
const grp = () => Array.from({ length: 4 }, hex).join("");
// Format: XX-XXXX-XXXX-XXXX (2 leading hex chars, then three 4-char groups)
const genSessionId = () => `${hex()}${hex()}-${grp()}-${grp()}-${grp()}`;

// Flagged visitors keep the same ID across sessions so "the system remembers you".
// Unflagged visitors get a fresh ID every new browser session.
export const getSessionId = () => {
	if (localStorage.getItem("secretAccessed") === "true") {
		let id = localStorage.getItem("persistentSessionId");
		if (!id) {
			id = genSessionId();
			localStorage.setItem("persistentSessionId", id);
		}
		return id;
	}
	let id = sessionStorage.getItem("sessionId");
	if (!id) {
		id = genSessionId();
		sessionStorage.setItem("sessionId", id);
	}
	return id;
};

export const getPageViews = () => Number(sessionStorage.getItem("pageViews") || 0);
export const incPageViews = () => {
	const n = getPageViews() + 1;
	sessionStorage.setItem("pageViews", String(n));
	return n;
};

export const getPopulation = () => {
	const stored = sessionStorage.getItem("population");
	return stored ? Number(stored) : POP_INITIAL;
};
export const setPopulation = (n) => sessionStorage.setItem("population", String(n));

export const isSecretAccessed = () => localStorage.getItem("secretAccessed") === "true";
export const markSecretAccessed = () => {
	localStorage.setItem("secretAccessed", "true");
	// Promote the current session ID to persistent so it stays stable across reloads.
	const current = sessionStorage.getItem("sessionId");
	if (current && !localStorage.getItem("persistentSessionId")) {
		localStorage.setItem("persistentSessionId", current);
	}
};

export const isComplianceSubmitted = () => sessionStorage.getItem("complianceSubmitted") === "true";
export const markComplianceSubmitted = () => sessionStorage.setItem("complianceSubmitted", "true");

// Tracks how many times SystemContent has mounted this session — drives the
// DAYS SINCE LAST INCIDENT cycling (odd visits reset to 0, even visits climb).
export const getSystemVisits = () => Number(sessionStorage.getItem("systemVisits") || 0);
export const incSystemVisits = () => {
	const n = getSystemVisits() + 1;
	sessionStorage.setItem("systemVisits", String(n));
	return n;
};

// Tracks RecordsContent mounts in localStorage so the Partridge mutation
// persists across browser sessions (per the brief).
export const getRecordsVisits = () => Number(localStorage.getItem("recordsVisits") || 0);
export const incRecordsVisits = () => {
	const n = getRecordsVisits() + 1;
	localStorage.setItem("recordsVisits", String(n));
	return n;
};

// Set once the 20-second inactivity timer fires on SYSTEM. Persists for the
// session — the caught text replaces the regular copy and no timer runs again.
export const isInactivityCaught = () => sessionStorage.getItem("inactivityCaught") === "true";
export const markInactivityCaught = () => sessionStorage.setItem("inactivityCaught", "true");

// Set when the inactivity timer auto-navigates to COMPLIANCE. Triggers the
// "you were redirected here" line above the form.
export const isForcedToCompliance = () => sessionStorage.getItem("forcedToCompliance") === "true";
export const markForcedToCompliance = () => sessionStorage.setItem("forcedToCompliance", "true");

// Used by Protocol Zero: wipe every trace and let the page reload fresh.
export const purgeAll = () => {
	sessionStorage.clear();
	localStorage.clear();
};
