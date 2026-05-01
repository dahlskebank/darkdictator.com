import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
	SECTIONS,
	STATUS_PHRASES,
	STATUS_PHRASES_FLAGGED,
	TOP_BAR,
	FOOTER,
	buildBootLines,
	SYSTEM_PAGE,
	DIRECTIVES_PAGE,
	RECORDS_PAGE,
	TRANSMISSIONS_PAGE,
	COMPLIANCE_PAGE,
	SECRET_TRIGGERS,
	SECRET_LONGPRESS_MS,
	SECRET_PAGE,
	buildSelfRecord,
	buildTransmission0000,
	TRANSMISSION_0001,
	TRANSMISSION_0002,
	PROTOCOL_ZERO_LINES,
	INACTIVITY_COPY,
	COMPLIANCE_FORCED_PREFIX,
	COMPLIANCE_FORCED_NOTE,
	daysSinceIncident,
	PARTRIDGE_ID,
	PARTRIDGE_REDACTED,
} from "./content.js";
import {
	getSessionId,
	getPageViews,
	incPageViews,
	getPopulation,
	setPopulation,
	isSecretAccessed,
	markSecretAccessed,
	isComplianceSubmitted,
	markComplianceSubmitted,
	purgeAll,
	isInactivityCaught,
	markInactivityCaught,
	isForcedToCompliance,
	markForcedToCompliance,
	incSystemVisits,
	incRecordsVisits,
} from "./state.js";

// ─── Audio Engine ───────────────────────────────────────────────────
// Web Audio synthesized on the fly — no audio assets shipped.
const AudioCtx = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
let audioCtx = null;
const getCtx = () => {
	if (!audioCtx) audioCtx = new AudioCtx();
	return audioCtx;
};

const playClick = () => {
	const ctx = getCtx();
	const t = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	const noise = ctx.createOscillator();
	const noiseGain = ctx.createGain();
	osc.type = "square";
	osc.frequency.setValueAtTime(1800, t);
	osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);
	gain.gain.setValueAtTime(0.15, t);
	gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
	osc.connect(gain).connect(ctx.destination);
	osc.start(t);
	osc.stop(t + 0.06);
	noise.type = "sawtooth";
	noise.frequency.setValueAtTime(120, t);
	noiseGain.gain.setValueAtTime(0.08, t);
	noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
	noise.connect(noiseGain).connect(ctx.destination);
	noise.start(t);
	noise.stop(t + 0.03);
};

const playClank = () => {
	const ctx = getCtx();
	const t = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	const osc2 = ctx.createOscillator();
	const gain2 = ctx.createGain();
	osc.type = "square";
	osc.frequency.setValueAtTime(90, t);
	osc.frequency.exponentialRampToValueAtTime(40, t + 0.12);
	gain.gain.setValueAtTime(0.2, t);
	gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
	osc.connect(gain).connect(ctx.destination);
	osc.start(t);
	osc.stop(t + 0.15);
	osc2.type = "triangle";
	osc2.frequency.setValueAtTime(2400, t);
	osc2.frequency.exponentialRampToValueAtTime(200, t + 0.02);
	gain2.gain.setValueAtTime(0.12, t);
	gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
	osc2.connect(gain2).connect(ctx.destination);
	osc2.start(t);
	osc2.stop(t + 0.05);
};

const playBoot = () => {
	const ctx = getCtx();
	const t = ctx.currentTime;
	[0, 0.08, 0.16, 0.28].forEach((offset, i) => {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "square";
		osc.frequency.setValueAtTime([200, 300, 400, 800][i], t + offset);
		gain.gain.setValueAtTime(0.06, t + offset);
		gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.07);
		osc.connect(gain).connect(ctx.destination);
		osc.start(t + offset);
		osc.stop(t + offset + 0.07);
	});
};

// Power-off / reset clunk.
const playDeny = () => {
	const ctx = getCtx();
	const t = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "square";
	osc.frequency.setValueAtTime(150, t);
	osc.frequency.setValueAtTime(100, t + 0.12);
	gain.gain.setValueAtTime(0.15, t);
	gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
	osc.connect(gain).connect(ctx.destination);
	osc.start(t);
	osc.stop(t + 0.3);
};

// Klaxon used when the secret page triggers.
const playAlert = () => {
	const ctx = getCtx();
	const t = ctx.currentTime;
	for (let i = 0; i < 4; i++) {
		const offset = i * 0.22;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "square";
		osc.frequency.setValueAtTime(440, t + offset);
		osc.frequency.linearRampToValueAtTime(920, t + offset + 0.1);
		osc.frequency.linearRampToValueAtTime(440, t + offset + 0.2);
		gain.gain.setValueAtTime(0.14, t + offset);
		gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.2);
		osc.connect(gain).connect(ctx.destination);
		osc.start(t + offset);
		osc.stop(t + offset + 0.21);
	}
	const noise = ctx.createOscillator();
	const ng = ctx.createGain();
	noise.type = "sawtooth";
	noise.frequency.setValueAtTime(60, t);
	ng.gain.setValueAtTime(0.08, t);
	ng.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
	noise.connect(ng).connect(ctx.destination);
	noise.start(t);
	noise.stop(t + 0.9);
};

// ─── Tiny helpers ───────────────────────────────────────────────────
const Blinker = () => {
	const [on, setOn] = useState(true);
	useEffect(() => {
		const i = setInterval(() => setOn((p) => !p), 530);
		return () => clearInterval(i);
	}, []);
	return <span style={{ opacity: on ? 1 : 0 }}>█</span>;
};

const Divider = () => (
	<div className="divider" aria-hidden="true">
		{"═".repeat(56)}
	</div>
);

// ─── Section components ─────────────────────────────────────────────

const SystemContent = ({ statusPhrase, sessionId, flagged, goToCompliance }) => {
	// Each mount counts as one SYSTEM visit. Drives the DAYS SINCE LAST
	// INCIDENT cycling. Read once via the lazy initializer so re-renders
	// don't double-count.
	const [systemVisits] = useState(() => incSystemVisits());

	// Population ticks down silently — 1-4 every 15-30 seconds. Persisted in
	// sessionStorage so the count stays consistent across page navigations.
	const [pop, setPop] = useState(() => getPopulation());
	useEffect(() => {
		let timeout;
		const tick = () => {
			const next = Math.max(0, getPopulation() - (1 + Math.floor(Math.random() * 4)));
			setPopulation(next);
			setPop(next);
			timeout = setTimeout(tick, 15000 + Math.random() * 15000);
		};
		timeout = setTimeout(tick, 15000 + Math.random() * 15000);
		return () => clearTimeout(timeout);
	}, []);

	// Inactivity timer. Three phases: 0 (default copy, silent countdown),
	// 1 "caught" at 20s, 2 "redirecting" at 30s, then force-nav at 33s.
	// Once caught, the session remembers it — the caught text replaces the
	// default permanently and the timer never runs again.
	// The whole chain (20→30→33) runs in this single effect so that calling
	// setPhase mid-chain doesn't tear it down. inCountdown is the gate that
	// tells the reset listener whether interactions still matter.
	const [phase, setPhase] = useState(() => (isInactivityCaught() ? "caughtMemory" : 0));
	useEffect(() => {
		if (isInactivityCaught()) return;
		let t1, t2, t3;
		let inCountdown = true;
		const schedule = () => {
			t1 = setTimeout(() => {
				inCountdown = false;
				markInactivityCaught();
				playDeny();
				setPhase(1);
				t2 = setTimeout(() => {
					setPhase(2);
					t3 = setTimeout(() => {
						markForcedToCompliance();
						playClank();
						goToCompliance();
					}, 3000);
				}, 10000);
			}, 20000);
		};
		const reset = () => {
			if (!inCountdown) return;
			clearTimeout(t1);
			schedule();
		};
		schedule();
		window.addEventListener("click", reset);
		window.addEventListener("keydown", reset);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
			window.removeEventListener("click", reset);
			window.removeEventListener("keydown", reset);
		};
	}, [goToCompliance]);

	// Pick the right bottom-of-page copy for the current phase.
	const closingCopy =
		phase === 1
			? flagged
				? INACTIVITY_COPY.caughtFlagged
				: INACTIVITY_COPY.caught
			: phase === 2
				? INACTIVITY_COPY.redirecting
				: phase === "caughtMemory"
					? INACTIVITY_COPY.caughtMemory
					: SYSTEM_PAGE.closing;

	// DAYS SINCE LAST INCIDENT cycling — overridden to 0 for flagged visitors
	// (per the brief: "you are the incident", no natural cycling).
	const dayData = flagged ? { value: 0, note: null } : daysSinceIncident(systemVisits);

	// Build the stats list with session-aware substitutions.
	const stats = SYSTEM_PAGE.stats.map((s) => {
		if (s.label === "POPULATION (ADJUSTED)") {
			return { ...s, value: pop.toLocaleString("en-US") };
		}
		if (flagged && s.label === "PENDING REVIEWS") {
			return { ...s, value: "1 (YOUR FILE)" };
		}
		if (s.label === "DAYS SINCE LAST INCIDENT") {
			return { ...s, value: String(dayData.value) };
		}
		return s;
	});
	stats.push({ label: "SESSION DESIGNATION", value: sessionId });

	return (
		<div>
			<div className="system-intro">{SYSTEM_PAGE.intro}</div>
			<p className="system-status">
				{">> "}
				{statusPhrase}
			</p>
			<Divider />
			<p className="system-warning">{SYSTEM_PAGE.warning}</p>
			<Divider />
			<p className="system-status-header">{SYSTEM_PAGE.statusHeader}</p>
			<div className="stats-block">
				{stats.map((s) => (
					<div key={s.label} className="stat-row">
						<span className="stat-label">{s.label}:</span>
						<span>{s.value}</span>
					</div>
				))}
			</div>
			{(flagged || dayData.note) && (
				<p className="stats-note">{flagged ? "NOTE: YOU ARE THE INCIDENT." : dayData.note}</p>
			)}
			<Divider />
			<div className={`system-closing${phase === 1 || phase === "caughtMemory" ? " system-closing--loud" : ""}`}>
				{closingCopy}
			</div>
		</div>
	);
};

const DirectivesContent = () => (
	<div>
		<p className="section-header">{DIRECTIVES_PAGE.header}</p>
		<Divider />
		{DIRECTIVES_PAGE.entries.map((e) => (
			<div key={e.id} className="directive-entry">
				<div className="entry-id">
					DIRECTIVE {e.id} — [EFFECTIVE {e.effective}]
				</div>
				{e.bodyRedacted && (
					<div className="directive-redacted" aria-hidden="true">
						{"█".repeat(45)}
						<br />
						{"█".repeat(45)}
						<br />
						{"█".repeat(45)}
					</div>
				)}
				<div className="entry-meta entry-body">{e.body}</div>
				<div className="entry-meta status-row">
					<span className="label">STATUS:</span>
					<span className={e.status === "ACTIVE" ? "status-active" : "status-inactive"}>{e.status}</span>
				</div>
			</div>
		))}
	</div>
);

const RecordsContent = ({ sessionId, flagged, pageViews }) => {
	// Count RECORDS visits in localStorage. Drives the Partridge mutation:
	// visit 1 = full entry, visit 2 = redacted, visit 3+ = entry removed.
	// Persists across browser sessions.
	const [recordsVisits] = useState(() => incRecordsVisits());

	// Apply the Partridge mutation based on visit count.
	let entries = RECORDS_PAGE.entries;
	if (recordsVisits === 2) {
		entries = entries.map((e) => (e.id === PARTRIDGE_ID ? PARTRIDGE_REDACTED : e));
	} else if (recordsVisits >= 3) {
		entries = entries.filter((e) => e.id !== PARTRIDGE_ID);
	}
	entries = [...entries];

	// After 3+ page views, append a synthetic record about the visitor
	// themselves — the payoff is the visitor realizing they've been filed.
	if (pageViews >= 3) {
		const now = new Date();
		const ts =
			now.getFullYear() +
			"." +
			String(now.getMonth() + 1).padStart(2, "0") +
			"." +
			String(now.getDate()).padStart(2, "0");
		entries.push(buildSelfRecord(sessionId, ts, flagged));
	}
	return (
		<div>
			<p className="section-header">{RECORDS_PAGE.header}</p>
			<p className="section-preamble">NOTE: {RECORDS_PAGE.preamble}</p>
			<Divider />
			{entries.map((e) => (
				<div key={e.id} className="record-entry">
					<div className="entry-id">ID: {e.id}</div>
					<div className="entry-meta">
						{e.fields.map(([label, value]) => (
							<div key={label}>
								<span className="label">{label}:</span>
								{value}
							</div>
						))}
					</div>
					{e.note && <div className="entry-note">NOTE: {e.note}</div>}
				</div>
			))}
		</div>
	);
};

const TransmissionsContent = ({ flagged, pageViews }) => {
	// Prepend session-aware transmissions on top of the archive. Order matters:
	// 0002 (the twist — flagged only) → 0001 (flagged only) → 0000 (3+ views) → archive.
	const extras = [];
	if (flagged) extras.push(TRANSMISSION_0002);
	if (flagged) extras.push(TRANSMISSION_0001);
	if (pageViews >= 3) extras.push(buildTransmission0000(pageViews));
	const entries = [...extras, ...TRANSMISSIONS_PAGE.entries];

	return (
		<div>
			<p className="section-header">{TRANSMISSIONS_PAGE.header}</p>
			<p className="section-preamble">{TRANSMISSIONS_PAGE.preamble}</p>
			<Divider />
			{entries.map((e) => (
				<div key={e.id} className="transmission-entry">
					<div className="entry-id">
						TRANSMISSION {e.id}
						{e.isNew ? "" : " — [TIMESTAMP REDACTED]"}
						{e.isNew && <span className="transmission-new"> [NEW]</span>}
					</div>
					<div className="entry-meta status-row">
						{e.lines.map(([voice, text], i) => (
							<span key={i} className="transmission-line">
								<span className="transmission-voice">{voice}:</span>
								{text}
							</span>
						))}
						<div className="transmission-end">[END TRANSMISSION]</div>
					</div>
				</div>
			))}
		</div>
	);
};

const ComplianceContent = ({ sessionId, flagged }) => {
	// Three distinct states the page can render in, in priority order:
	//   1. flagged + never submitted  → administrative override (form denied)
	//   2. submitted in a prior visit → returned panel ("received, no re-verification")
	//   3. just submitted in this mount → live confirmation with fade repeats
	//   4. otherwise                 → the form itself
	// `justSubmitted` is local so it only shows on the mount where submit was
	// actually clicked; on the next visit we fall through to state 2.
	const [justSubmitted, setJustSubmitted] = useState(false);
	const alreadySubmitted = isComplianceSubmitted();
	const forced = isForcedToCompliance();

	const header = (
		<>
			<p className="section-header">{COMPLIANCE_PAGE.header}</p>
		</>
	);

	// State 1: flagged administrative override — form is closed.
	if (flagged && !alreadySubmitted && !justSubmitted) {
		const o = COMPLIANCE_PAGE.overridden;
		return (
			<div>
				{header}
				<p className="compliance-preamble">{COMPLIANCE_PAGE.preamble}</p>
				<Divider />
				<div className="compliance-submitted">
					<p className="compliance-submitted-status">{o.status}</p>
					<p className="compliance-submitted-line">{o.line1}</p>
					<p className="compliance-submitted-line">{o.line2}</p>
					<p className="compliance-submitted-body">{o.body}</p>
				</div>
				<button
					type="button"
					className="compliance-btn disabled"
					aria-disabled="true"
					onMouseEnter={playDeny}
					onFocus={playDeny}
					onClick={playDeny}
				>
					{o.submitLabel}
				</button>
			</div>
		);
	}

	// State 2: visitor already submitted in a prior visit this session.
	if (alreadySubmitted && !justSubmitted) {
		const r = COMPLIANCE_PAGE.returned;
		return (
			<div>
				{header}
				<Divider />
				<div className="compliance-submitted">
					<p className="compliance-submitted-line1">{r.line1}</p>
					<p className="compliance-submitted-line">Session ID: {sessionId}</p>
					<p className="compliance-submitted-line">{r.line2}</p>
					<p className="compliance-submitted-body">{r.body}</p>
					<div className="compliance-repeats">
						{r.repeats.map((l, i) => (
							<p key={i} className={`compliance-repeat${i === 0 ? "" : ` fade-step-${i}`}`}>
								{l}
							</p>
						))}
					</div>
				</div>
			</div>
		);
	}

	// State 3 & 4: fresh form → confirmation.
	return (
		<div>
			{header}
			{forced && <p className="compliance-forced">{COMPLIANCE_FORCED_PREFIX}</p>}
			<p className="compliance-preamble">{COMPLIANCE_PAGE.preamble}</p>
			<Divider />
			<p className="compliance-prompt">{COMPLIANCE_PAGE.prompt}</p>
			<ul className="compliance-list">
				{COMPLIANCE_PAGE.statements.map((s, i) => (
					<li key={i}>
						<span className="compliance-tick">[✓]</span>
						<span>{s}</span>
					</li>
				))}
			</ul>
			{!justSubmitted ? (
				<button
					type="button"
					className="compliance-btn"
					onClick={() => {
						playClank();
						markComplianceSubmitted();
						setJustSubmitted(true);
					}}
				>
					{COMPLIANCE_PAGE.submitLabel}
				</button>
			) : (
				<div className="compliance-submitted">
					<p className="compliance-submitted-line1">{COMPLIANCE_PAGE.submitted.line1}</p>
					<p className="compliance-submitted-line">{COMPLIANCE_PAGE.submitted.line2}</p>
					<p className="compliance-submitted-line">Session ID: {sessionId}</p>
					<p className="compliance-submitted-status">
						{forced
							? COMPLIANCE_PAGE.submitted.status + " — UNDER REVIEW"
							: COMPLIANCE_PAGE.submitted.status}
					</p>
					{forced && <p className="compliance-submitted-line">{COMPLIANCE_FORCED_NOTE}</p>}
					<p className="compliance-submitted-body">{COMPLIANCE_PAGE.submitted.body}</p>
					<div className="compliance-repeats">
						{COMPLIANCE_PAGE.submitted.repeats.map((r, i) => (
							<p key={i} className={`compliance-repeat${i === 0 ? "" : ` fade-step-${i}`}`}>
								{r}
							</p>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

const CONTENT_MAP = {
	system: SystemContent,
	directives: DirectivesContent,
	records: RecordsContent,
	transmissions: TransmissionsContent,
	compliance: ComplianceContent,
};

// ─── Boot Sequence ──────────────────────────────────────────────────
const BootSequence = ({ onDone, bootLines }) => {
	const [lines, setLines] = useState([]);

	useEffect(() => {
		let i = 0;
		playBoot();
		const interval = setInterval(() => {
			if (i < bootLines.length) {
				// Snapshot the current index into a local const so the functional
				// updater below reads *this tick's* line, not whatever `i` has been
				// advanced to by the time React processes the update. Without this,
				// batched / deferred updaters close over the mutable `i` and can
				// skip one line and duplicate the next.
				const line = bootLines[i];
				setLines((prev) => [...prev, line]);
				if (i % 2 === 0) playClick();
				i++;
			} else {
				clearInterval(interval);
				setTimeout(onDone, 1200);
			}
		}, 320);
		return () => clearInterval(interval);
	}, [onDone, bootLines]);

	return (
		<div className="boot-sequence">
			{lines.map((l, i) => (
				<div key={i} className="boot-line">
					{l || "\u00A0"}
				</div>
			))}
			<Blinker />
		</div>
	);
};

// ─── Intrusion (secret page) ───────────────────────────────────────
const IntrusionPanel = ({ onClose }) => {
	const panelRef = useRef(null);
	const closeRef = useRef(null);

	// The close button sits at the bottom of the panel. Using autoFocus or
	// normal focus() would pull it into view and land the visitor at the
	// bottom. Focus with preventScroll, then pin the panel to the top.
	useEffect(() => {
		if (panelRef.current) panelRef.current.scrollTop = 0;
		closeRef.current?.focus({ preventScroll: true });
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="intrusion-panel flicker" role="alertdialog" aria-labelledby="intrusion-title" ref={panelRef}>
			<div className="intrusion-title" id="intrusion-title">
				{SECRET_PAGE.title}
			</div>
			<div className="intrusion-sub">{SECRET_PAGE.sub}</div>

			<div className="intrusion-box">
				<div className="intrusion-preamble">{SECRET_PAGE.preamble}</div>
			</div>

			{SECRET_PAGE.boxes.map((box, i) => (
				<div key={i} className="intrusion-box">
					<h3>{box.heading}</h3>
					{box.lines &&
						box.lines.map((line, j) => (
							<div key={j} className={line ? "intrusion-line" : "intrusion-line empty"}>
								{line}
							</div>
						))}
					{box.list && (
						<div className="intrusion-list">
							{box.list.map((item, j) => (
								<div key={j} className="intrusion-list-item">
									{item.startsWith("0") || /^\d/.test(item) ? "  " : "• "}
									{item}
								</div>
							))}
						</div>
					)}
				</div>
			))}

			<div className="intrusion-box intrusion-warn">
				<h3>{SECRET_PAGE.warn.heading}</h3>
				{SECRET_PAGE.warn.lines.map((l, i) => (
					<div key={i}>{l}</div>
				))}
			</div>

			<button className="intrusion-close" ref={closeRef} onClick={onClose}>
				{SECRET_PAGE.closeLabel}
			</button>
		</div>
	);
};

// ─── Protocol Zero ─────────────────────────────────────────────────
// The hidden reset — once the visitor has been flagged, the footer
// reveals a dim link that purges all session/local state and reboots
// the terminal. The component takes over the whole screen while running.
const ProtocolZero = () => {
	// completed: lines fully typed. current: the line currently being typed.
	// Separating them lets us keep a blinking cursor on only the in-progress line.
	const [completed, setCompleted] = useState([]);
	const [current, setCurrent] = useState("");

	useEffect(() => {
		playClank();
		let cancelled = false;
		const timeouts = [];
		const push = (fn, ms) => {
			timeouts.push(setTimeout(fn, ms));
		};

		const typeLine = (idx) => {
			if (cancelled) return;
			const line = PROTOCOL_ZERO_LINES[idx];

			if (line === undefined) {
				// All lines typed — pause, then nuke storage and reboot the terminal.
				push(() => {
					purgeAll();
					window.location.reload();
				}, 2000);
				return;
			}
			if (line === "") {
				setCompleted((prev) => [...prev, ""]);
				push(() => typeLine(idx + 1), 300);
				return;
			}

			playClick();
			let i = 0;
			const typeChar = () => {
				if (cancelled) return;
				i++;
				setCurrent(line.slice(0, i));
				if (i < line.length) {
					push(typeChar, 40);
				} else {
					setCompleted((prev) => [...prev, line]);
					setCurrent("");
					push(() => typeLine(idx + 1), 400);
				}
			};
			typeChar();
		};

		push(() => typeLine(0), 1500);
		return () => {
			cancelled = true;
			timeouts.forEach(clearTimeout);
		};
	}, []);

	return (
		<div className="protocol-zero">
			{completed.map((l, i) => (
				<div key={i} className="protocol-zero-line">
					{l || "\u00A0"}
				</div>
			))}
			{current && (
				<div className="protocol-zero-line">
					{current}
					<span className="protocol-zero-cursor">█</span>
				</div>
			)}
		</div>
	);
};

// ─── Main App ───────────────────────────────────────────────────────
export default function DarkDictator() {
	const [booted, setBooted] = useState(false);
	const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
	const [focusIdx, setFocusIdx] = useState(0);
	const [showContent, setShowContent] = useState(false);
	const [secretOpen, setSecretOpen] = useState(false);
	// CRT-collapse animation flag. Set true at the start of nav/reset, drives
	// the .crt-collapsing class on .screen-content. Cleared after the full
	// 450ms animation. The actual content swap fires at the 200ms trough.
	const [collapsing, setCollapsing] = useState(false);
	const [flagged, setFlagged] = useState(() => isSecretAccessed());
	const [pageViews, setPageViews] = useState(() => getPageViews());
	const [protocolZero, setProtocolZero] = useState(false);
	const keyBuffer = useRef("");
	const navRefs = useRef([]);
	const containerRef = useRef(null);
	const contentRef = useRef(null);

	// Session ID is stable for the lifetime of the component — for unflagged
	// visitors it's fresh per browser session, for flagged visitors it's
	// promoted to persistent in state.js/markSecretAccessed.
	const sessionId = useMemo(() => getSessionId(), []);

	// Status phrase rotates on every navigate. Picks from flagged pool if
	// the secret has been accessed — reading the flag at selection time
	// makes the swap reactive without any extra wiring.
	const [statusPhrase, setStatusPhrase] = useState(() => {
		const pool = isSecretAccessed() ? STATUS_PHRASES_FLAGGED : STATUS_PHRASES;
		return pool[Math.floor(Math.random() * pool.length)];
	});

	// Boot sequence is built once from the real session ID + flagged flag.
	const bootLines = useMemo(() => buildBootLines(sessionId, flagged), [sessionId, flagged]);

	// Rotate the top status phrase on an interval while booted. Navigation
	// still re-picks on its own (below) — this adds the ambient cycling.
	useEffect(() => {
		if (!booted) return;
		const interval = setInterval(() => {
			const pool = isSecretAccessed() ? STATUS_PHRASES_FLAGGED : STATUS_PHRASES;
			setStatusPhrase(pool[Math.floor(Math.random() * pool.length)]);
		}, 7000);
		return () => clearInterval(interval);
	}, [booted]);

	const navigate = useCallback((id, idx) => {
		playClank();
		// Trigger the CRT collapse, swap content at the trough (~200ms),
		// clear the class after the full 450ms ease so the bounce-back reveal
		// completes before the screen-content goes back to its plain state.
		setCollapsing(true);
		setShowContent(false);
		setTimeout(() => {
			setActiveSection(id);
			setFocusIdx(idx);
			const n = incPageViews();
			setPageViews(n);
			const pool = isSecretAccessed() ? STATUS_PHRASES_FLAGGED : STATUS_PHRASES;
			setStatusPhrase(pool[Math.floor(Math.random() * pool.length)]);
			// Always land at the top of the new section, not wherever the previous
			// page was scrolled to.
			contentRef.current?.scrollTo({ top: 0 });
			setShowContent(true);
		}, 150);
		setTimeout(() => setCollapsing(false), 350);
	}, []);

	const navPrev = useCallback(() => {
		setFocusIdx((cur) => {
			const next = (cur - 1 + SECTIONS.length) % SECTIONS.length;
			playClick();
			navRefs.current[next]?.focus();
			return next;
		});
	}, []);

	const navNext = useCallback(() => {
		setFocusIdx((cur) => {
			const next = (cur + 1) % SECTIONS.length;
			playClick();
			navRefs.current[next]?.focus();
			return next;
		});
	}, []);

	const navSelect = useCallback(() => {
		navigate(SECTIONS[focusIdx].id, focusIdx);
	}, [focusIdx, navigate]);

	const resetTerminal = useCallback(() => {
		playDeny();
		// Same collapse-then-swap pattern as navigation. The picture squashes
		// to a line, the booted layout unmounts at the trough, and the boot
		// sequence becomes visible during the bounce-back — sells "real
		// power-cycle" rather than "instant snap to boot".
		setCollapsing(true);
		setTimeout(() => {
			setBooted(false);
			setActiveSection(SECTIONS[0].id);
			setFocusIdx(0);
			setShowContent(false);
			setSecretOpen(false);
			keyBuffer.current = "";
		}, 150);
		setTimeout(() => setCollapsing(false), 350);
	}, []);

	const initiateProtocolZero = useCallback(() => {
		setProtocolZero(true);
	}, []);

	// Fullscreen toggle for the mobile button bar. iOS Safari doesn't support
	// the Fullscreen API for non-video elements, so the button is a no-op
	// there by design (users on iOS get fullscreen via add-to-home-screen,
	// courtesy of the PWA manifest + apple-mobile-web-app-capable meta).
	const [isFullscreen, setIsFullscreen] = useState(false);
	useEffect(() => {
		const onChange = () => setIsFullscreen(!!document.fullscreenElement);
		document.addEventListener("fullscreenchange", onChange);
		return () => document.removeEventListener("fullscreenchange", onChange);
	}, []);
	const toggleFullscreen = useCallback(() => {
		playClick();
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen?.().catch(() => {});
		} else {
			document.exitFullscreen?.().catch(() => {});
		}
	}, []);

	// Passed to SystemContent's inactivity timer to force-nav to COMPLIANCE.
	const goToCompliance = useCallback(() => {
		const idx = SECTIONS.findIndex((s) => s.id === "compliance");
		navigate("compliance", idx);
	}, [navigate]);

	// Single path into the secret page — used by the keyboard buffer AND the
	// mobile long-press on the ◉ brand dot. Keeping one callback means the
	// two entry points can't drift out of sync.
	const openSecret = useCallback(() => {
		playAlert();
		markSecretAccessed();
		setFlagged(true);
		setSecretOpen(true);
		// If triggered from deep in a scrolled page, pin the intrusion panel to
		// the top so the visitor sees the title first, not a mid-dossier jump.
		window.scrollTo(0, 0);
	}, []);

	// Easter-egg keyboard buffer — match against any trigger in SECRET_TRIGGERS.
	useEffect(() => {
		const longestTrigger = Math.max(...SECRET_TRIGGERS.map((s) => s.length));
		const handler = (e) => {
			if (e.key === "Escape" && secretOpen) {
				playClank();
				setSecretOpen(false);
				return;
			}
			if (e.key && e.key.length === 1) {
				keyBuffer.current = (keyBuffer.current + e.key.toUpperCase()).slice(-Math.max(10, longestTrigger));
				if (SECRET_TRIGGERS.some((t) => keyBuffer.current.endsWith(t))) {
					keyBuffer.current = "";
					openSecret();
				}
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [secretOpen, openSecret]);

	// Long-press the ◉ brand dot OR the "1984" in the copyright to open the
	// secret page — a hidden alternative to typing OBEY / 1984. Pointer events
	// cover touch + mouse + pen in one handler set. Using a target identifier
	// ("brand" | "year") lets each element show its own pressing state
	// without the other lighting up in sympathy.
	const longPressTimer = useRef(null);
	const [longPressTarget, setLongPressTarget] = useState(null);
	const cancelLongPress = useCallback(() => {
		if (longPressTimer.current) {
			clearTimeout(longPressTimer.current);
			longPressTimer.current = null;
		}
		setLongPressTarget(null);
	}, []);
	const startLongPress = useCallback(
		(target) => (e) => {
			// Prevent the OS text-selection callout / context menu from appearing
			// mid-press on mobile; the whole point is an uninterrupted hold.
			e.preventDefault();
			setLongPressTarget(target);
			longPressTimer.current = setTimeout(() => {
				longPressTimer.current = null;
				setLongPressTarget(null);
				openSecret();
			}, SECRET_LONGPRESS_MS);
		},
		[openSecret],
	);

	// Standard nav keys (1-5, arrows, Enter) — only after boot.
	useEffect(() => {
		if (!booted) return;
		const handler = (e) => {
			if (e.key >= "1" && e.key <= String(SECTIONS.length)) {
				const idx = parseInt(e.key, 10) - 1;
				navigate(SECTIONS[idx].id, idx);
				navRefs.current[idx]?.focus();
				e.preventDefault();
			}
			if (e.key === "ArrowLeft") {
				navPrev();
				e.preventDefault();
			}
			if (e.key === "ArrowRight") {
				navNext();
				e.preventDefault();
			}
			if (e.key === "Enter") {
				navSelect();
				e.preventDefault();
			}
			// Vertical arrows + Page/Home/End scroll the inner .content-area.
			// content-area has its own overflow so it's the only scroll surface.
			const el = contentRef.current;
			if (el) {
				if (e.key === "ArrowUp") {
					el.scrollBy({ top: -60, behavior: "smooth" });
					e.preventDefault();
				}
				if (e.key === "ArrowDown") {
					el.scrollBy({ top: 60, behavior: "smooth" });
					e.preventDefault();
				}
				if (e.key === "PageUp") {
					el.scrollBy({ top: -el.clientHeight * 0.8, behavior: "smooth" });
					e.preventDefault();
				}
				if (e.key === "PageDown") {
					el.scrollBy({ top: el.clientHeight * 0.8, behavior: "smooth" });
					e.preventDefault();
				}
				if (e.key === "Home") {
					el.scrollTo({ top: 0, behavior: "smooth" });
					e.preventDefault();
				}
				if (e.key === "End") {
					el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
					e.preventDefault();
				}
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [booted, navigate, navPrev, navNext, navSelect]);

	useEffect(() => {
		if (booted) {
			setTimeout(() => setShowContent(true), 300);
			navRefs.current[0]?.focus();
		}
	}, [booted]);

	const ContentComponent = CONTENT_MAP[activeSection];
	const currentSection = SECTIONS.find((s) => s.id === activeSection);

	return (
		<div className="crt-monitor">
			<div className="crt-housing">
				<div className="crt-screen-frame">
					<div className={`crt-container ${secretOpen ? "red-mode" : ""}`} ref={containerRef} tabIndex={-1}>
						<div className="crt-roll" aria-hidden="true"></div>
						<div className="crt-mask" aria-hidden="true"></div>
						<div className="crt-noise" aria-hidden="true"></div>

						<div className={`screen-content${collapsing ? " crt-collapsing" : ""}`}>
							{protocolZero ? (
								<ProtocolZero />
							) : secretOpen ? (
								<IntrusionPanel
									onClose={() => {
										playClank();
										setSecretOpen(false);
									}}
								/>
							) : !booted ? (
								<div className="boot-scroll">
									<BootSequence
										bootLines={bootLines}
										onDone={() => {
											setBooted(true);
											playClank();
										}}
									/>
								</div>
							) : (
								<div className="fade-in booted-layout">
									<div className="top-bar">
										<span>
											<span
												className={`brand-icon${longPressTarget === "brand" ? " brand-icon--pressing" : ""}`}
												role="button"
												tabIndex={-1}
												aria-label="State emblem"
												onPointerDown={startLongPress("brand")}
												onPointerUp={cancelLongPress}
												onPointerLeave={cancelLongPress}
												onPointerCancel={cancelLongPress}
												onContextMenu={(e) => e.preventDefault()}
											>
												{TOP_BAR.brandIcon}
											</span>
											{TOP_BAR.brandText}
										</span>
										<span>{TOP_BAR.node}</span>
										<span>
											{new Date().toLocaleTimeString("en-GB", {
												hour: "2-digit",
												minute: "2-digit",
											})}{" "}
											STATE
										</span>
									</div>

									<nav className="nav-bar" role="menubar" aria-label="Main navigation">
										{SECTIONS.map((s, i) => (
											<button
												key={s.id}
												ref={(el) => (navRefs.current[i] = el)}
												className={`nav-item ${activeSection === s.id ? "active" : ""}`}
												role="menuitem"
												tabIndex={focusIdx === i ? 0 : -1}
												onClick={() => navigate(s.id, i)}
												onFocus={() => {
													playClick();
													setFocusIdx(i);
												}}
												aria-current={activeSection === s.id ? "page" : undefined}
											>
												<span className="nav-num">{s.num}</span>
												<span className="nav-label">{s.label}</span>
												<span className="nav-label-short">{s.labelShort}</span>
											</button>
										))}
									</nav>

									<div className="content-area" ref={contentRef}>
										<div className="content-header phosphor-trail">{currentSection?.title}</div>
										{showContent && (
											<div className="fade-in">
												<ContentComponent
													statusPhrase={statusPhrase}
													sessionId={sessionId}
													flagged={flagged}
													pageViews={pageViews}
													goToCompliance={goToCompliance}
												/>
											</div>
										)}
									</div>

									<div className="footer-bar">
										{FOOTER.hints.map((h, i) => (
											<span key={i}>{flagged ? h.replace("[DISABLED]", "[DENIED]") : h}</span>
										))}
										{flagged && <span>STATUS: FLAGGED</span>}
									</div>
									{flagged && (
										<div className="protocol-zero-row">
											<button
												type="button"
												className="protocol-zero-link"
												onClick={initiateProtocolZero}
											>
												[INITIATE PROTOCOL ZERO]
											</button>
										</div>
									)}
									<div className="copyright-bar">
										{FOOTER.copyrightPrefix}
										<span
											className={`copyright-year${longPressTarget === "year" ? " copyright-year--pressing" : ""}`}
											role="button"
											tabIndex={-1}
											aria-label={FOOTER.copyrightYear}
											onPointerDown={startLongPress("year")}
											onPointerUp={cancelLongPress}
											onPointerLeave={cancelLongPress}
											onPointerCancel={cancelLongPress}
											onContextMenu={(e) => e.preventDefault()}
										>
											{FOOTER.copyrightYear}
										</span>
									</div>
								</div>
							)}
						</div>

						{booted && (
							<div className="mobile-controls" role="group" aria-label="Navigation controls">
								<button className="mobile-ctrl-btn" onClick={navPrev} aria-label="Previous">
									◄
								</button>
								<button
									className="mobile-ctrl-btn mobile-ctrl-enter"
									onClick={navSelect}
									aria-label="Select"
								>
									ENTER
								</button>
								<button className="mobile-ctrl-btn" onClick={navNext} aria-label="Next">
									►
								</button>
								<button
									className={`mobile-ctrl-btn mobile-ctrl-fs${isFullscreen ? " mobile-ctrl-fs--active" : ""}`}
									onClick={toggleFullscreen}
									aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
									title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
								>
									⛶
								</button>
							</div>
						)}
					</div>
				</div>
				<div className="crt-label">
					<span className="crt-label-bracket" aria-hidden="true">
						«
					</span>
					<a href="https://dfault.it/" target="_blank" rel="noopener noreferrer" title="D-FAULT PENDING">
						DFp
					</a>
					<span className="crt-label-sep" aria-hidden="true">
						‹›
					</span>
					<a href="https://dahlskebank.com/" target="_blank" rel="noopener noreferrer" title="Dahlske Bank">
						dB
					</a>
					<span className="crt-label-sep" aria-hidden="true">
						‹›
					</span>
					<a href="https://danieldahl.com/" target="_blank" rel="noopener noreferrer" title="Daniel Dahl">
						dD
					</a>
					<span className="crt-label-sep" aria-hidden="true">
						‹›
					</span>
					<a href="https://dxd.no/" target="_blank" rel="noopener noreferrer" title="deus ex Dahl">
						dxD
					</a>
					<span className="crt-label-bracket" aria-hidden="true">
						»
					</span>
				</div>
				<button
					type="button"
					className="crt-led"
					onClick={resetTerminal}
					aria-label="Power / reset"
					title="Power / reset"
				/>
			</div>
		</div>
	);
}
