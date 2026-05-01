# DARKDICTATOR.COM — DYNAMIC BEHAVIORS

Specification for dynamic elements that make the terminal
feel alive and aware. These should be subtle. No animations
or flashy transitions — just data that quietly changes.
The visitor should discover these on their own.

Use sessionStorage to track state within a single visit.
Use localStorage to persist state across visits.

---

## 1. POPULATION COUNT (SYSTEM page)

The population figure displayed on the SYSTEM page
should tick down slowly while the visitor is on the page.

- Starting value: `42,661,080`
- Every 15-30 seconds (randomized interval), subtract
  a random number between 1 and 4
- Never tick up. Only down.
- The number should update in place without any transition
  or highlight — just silently change
- Store the current count in sessionStorage so it stays
  consistent if the visitor navigates away and returns
  during the same session
- On a fresh session, reset to the starting value

The effect: visitors who stare at the stats long enough
will notice the population is shrinking in real time.

---

## 2. DAYS SINCE LAST INCIDENT (SYSTEM page)

The counter that reads `DAYS SINCE LAST INCIDENT: 0`
should change based on how many times the visitor has
viewed the SYSTEM page in their current session.

- First visit: `0`
- Second visit: `1`
- Third visit: `0` (reset, with note changed to
  `NOTE: PREVIOUS COUNT (1) RESET PER PROTOCOL.`)
- Fourth visit: `2`
- Fifth visit: `0` again

Track view count in sessionStorage. The counter goes
up but keeps getting reset back to zero unpredictably.
Something keeps happening.

---

## 3. RECORD MUTATION (RECORDS page)

One citizen record should change between visits to the
RECORDS page within the same session.

Target: The Partridge entry (ID: LIB-0962-K)

**First visit:**
```
ID: LIB-0962-K
NAME: PARTRIDGE, E.
OCCUPATION: CLERIC — FIRST CLASS
STATUS: SENSE OFFENSE — TERMINATED
LAST UPDATE: 2071.08.17
NOTE: Contraband poetry recovered at site.
Volume destroyed per Directive 0017.
```

**Second visit:**
```
ID: LIB-0962-K
NAME: ████████, ██
OCCUPATION: ██████████
STATUS: ██████████ — SEE DIRECTIVE 0071
LAST UPDATE: ██████████
NOTE: This record has been revised in accordance
with Bureau of Information standards.
```

**Third visit and beyond:**
The entry is gone entirely. The other records close
the gap as if it was never there.

Track visits to the RECORDS page in sessionStorage.
The system is erasing Partridge from history — an
unperson, exactly like 1984.

---

## 4. VISITOR-AWARE TRANSMISSION (TRANSMISSIONS page)

A new transmission should appear at the top of the
TRANSMISSIONS page based on session state.

**If the visitor has viewed 3 or more pages:**
Prepend this transmission above the existing ones:

```
TRANSMISSION 0000 — [CURRENT SESSION]           [NEW]

[VOICE 1]: The guest is still here.
[VOICE 2]: How many pages?
[VOICE 1]: [INSERT ACTUAL PAGE VIEW COUNT].
[VOICE 2]: Noted. Continue monitoring.
[END TRANSMISSION]
```

The page view count should be the real number of
pages the visitor has navigated to in their session.
Track in sessionStorage.

**If the visitor has also accessed the secret page:**
Add a second transmission below 0000:

```
TRANSMISSION 0001 — [CURRENT SESSION]           [NEW]

[VOICE 1]: They found it.
[VOICE 2]: The document?
[VOICE 1]: Yes.
[VOICE 2]: ... How?
[VOICE 1]: Unknown. Flagging session.
[END TRANSMISSION]
```

Track whether the secret page has been viewed in
sessionStorage.

---

## 5. SESSION ID SEEDING (across all pages)

During the boot sequence, generate a random hex
session ID in this format: `XX-████-████-████`
where X is a hex character. Store it in sessionStorage.

This session ID should appear:

- In the boot sequence: `ASSIGNING GUEST DESIGNATION: [SESSION ID]`
- On the SYSTEM page status area (already there)
- In the Compliance confirmation after submitting
- **On the RECORDS page** — after the visitor has viewed
  3+ pages, append a new record at the very bottom:

```
ID: [SESSION ID]
NAME: [PENDING IDENTIFICATION]
OCCUPATION: UNKNOWN
GENETIC TIER: UNASSESSED
STATUS: UNDER OBSERVATION
LAST UPDATE: [CURRENT TIMESTAMP]
NOTE: Guest terminal session. Classification
in progress. Do not alert subject.
```

Use the same session ID everywhere. The visitor
should eventually realize the system has created
a file on *them*.

---

## 6. COMPLIANCE PAGE STATE (COMPLIANCE page)

After the visitor clicks "SUBMIT VERIFICATION",
store a flag in sessionStorage.

**If they return to the COMPLIANCE page after submitting:**

Do not show the form again. Instead display:

```
COMPLIANCE VERIFICATION — FORM CV-12

Your verification was received and recorded
under Session ID: [SESSION ID].

Current compliance status: CONDITIONAL

Re-verification is not available at this time.
Your next scheduled verification window has
not yet been determined.

Do not contact the Bureau regarding this matter.
You will be contacted.

    You will be contacted.

        You will be contacted.
```

Same fading repetition treatment as the original
"at this time" — each line slightly dimmer.

---

## 7. GLOBAL PAGE VIEW COUNTER (footer area)

In the footer, add a small inconspicuous counter
on the far right side:

```
REQUESTS THIS SESSION: [N]
```

This should increment every time the visitor
navigates to any page. Just a quiet reminder
that everything is being counted.

---

## PRIORITY ORDER

If implementation time is limited, prioritize:

1. Session ID seeding (ties everything together)
2. Visitor-aware transmission (biggest payoff)
3. Population countdown (most noticeable)
4. Compliance page state (rewards repeat visits)
5. Record mutation (rewards careful readers)
6. Days since last incident (subtle)
7. Global page view counter (smallest detail)

---

## TECHNICAL NOTES

- Use sessionStorage for within-visit state
- Use localStorage only if you want the record
  mutation and compliance state to persist across
  visits (recommended — makes revisiting the site
  feel different)
- All dynamic text should render in the same style
  as static text — no special formatting, no
  highlights, no transitions. The point is that
  the visitor questions whether it changed or
  whether they misread it the first time.
- The population counter is the one exception
  where real-time updates happen — but even that
  should be silent, no animation.
