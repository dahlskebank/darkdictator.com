# DARKDICTATOR.COM — POST-SECRET-PAGE CHANGES

When the visitor accesses the secret page (by typing
"obey"), set a flag in localStorage:

  secretAccessed: true

This flag persists across sessions. The site never
forgets. The following changes should apply on every
page whenever this flag is true.

---

## 1. TOP STATUS BAR CHANGES

The rotating status messages should pull from a
different pool after the secret page is accessed.

Replace the normal rotation with:

- SESSION FLAGGED — MONITORING ELEVATED
- YOUR COMPLIANCE STATUS HAS BEEN NOTED
- DO NOT ATTEMPT TO ACCESS RESTRICTED FILES AGAIN
- COUNTER-INTELLIGENCE REVIEW: PENDING
- ALL ACTIVITY IN THIS SESSION IS BEING FORWARDED
- SECTOR 13 — GUEST PRIVILEGES UNDER REVIEW
- YOU WERE WARNED
- TRUST IS A RESOURCE. YOURS HAS BEEN SPENT.
- TERMINAL INTEGRITY: COMPROMISED
- RESUME NORMAL ACTIVITY. THIS IS A TEST.

These should rotate the same way as the normal
messages but the tone is now directed at the visitor.

---

## 2. BOOT SEQUENCE CHANGES

If the visitor returns to the site after having
accessed the secret page in a previous session,
the boot sequence should be slightly different:

Replace:
```
CITIZEN PROFILE: NOT FOUND
ASSIGNING GUEST DESIGNATION: VISITOR-████
ACCESS GRANTED — CLEARANCE: PROVISIONAL
```

With:
```
CITIZEN PROFILE: FLAGGED
REINSTATING GUEST DESIGNATION: [SAME SESSION ID]
ACCESS GRANTED — CLEARANCE: RESTRICTED

NOTE: PREVIOUS SESSION VIOLATIONS ON RECORD.
MONITORING LEVEL: ELEVATED.
PROCEED.
```

Store the session ID in localStorage so it
persists. The system remembers who you are.
Same ID every time you come back.

---

## 3. SYSTEM PAGE — STAT CHANGES

On the SYSTEM page, two stats should change:

Before secret page:
```
PENDING REVIEWS:          CLASSIFIED
```

After secret page:
```
PENDING REVIEWS:          1 (YOUR FILE)
```

Before secret page:
```
DAYS SINCE LAST INCIDENT: 0
```

After secret page:
```
DAYS SINCE LAST INCIDENT: 0
NOTE: YOU ARE THE INCIDENT.
```

The second one overrides the normal day-counter
cycling behavior from the dynamic behaviors spec.
It's always 0 now. Because of you.

---

## 4. DIRECTIVES PAGE — NEW DIRECTIVE

Append a new directive at the bottom of the list,
only visible after the secret page has been accessed:

```
DIRECTIVE 0099 — [EFFECTIVE: CURRENT SESSION]
A guest terminal user has accessed materials
beyond their clearance designation. Standard
containment protocol is in effect. The user
is advised to continue browsing normally.

Behavioral analysis is ongoing.

Any attempt to share, reproduce, or reference
the contents of the accessed document will
result in immediate session termination and
permanent designation reclassification.

This directive was generated automatically.
It cannot be appealed.
STATUS: WATCHING
```

---

## 5. RECORDS PAGE — YOUR FILE UPDATES

The visitor's auto-generated record at the bottom
(from the session ID seeding spec) should change
after the secret page:

Before:
```
ID: [SESSION ID]
NAME: [PENDING IDENTIFICATION]
OCCUPATION: UNKNOWN
GENETIC TIER: UNASSESSED
STATUS: UNDER OBSERVATION
LAST UPDATE: [TIMESTAMP]
NOTE: Guest terminal session. Classification
in progress. Do not alert subject.
```

After:
```
ID: [SESSION ID]
NAME: [PENDING IDENTIFICATION]
OCCUPATION: UNKNOWN
GENETIC TIER: UNASSESSED
STATUS: NON-COMPLIANT — CLEARANCE VIOLATION
PREDICTED TRAJECTORY: HOSTILE
LAST UPDATE: [CURRENT TIMESTAMP]
NOTE: Subject accessed classified document
[PROJECT: OPEN WINDOW] without authorization.
Session flagged. File escalated to Bureau of
Internal Affairs. Physical identification
in progress.

DO NOT ALERT SUBJECT.
```

---

## 6. TRANSMISSIONS PAGE — NEW TRANSMISSIONS

After the secret page, add two new transmissions
at the top of the page, above any session-aware
transmissions from the previous spec:

```
TRANSMISSION 0002 — [CURRENT SESSION]           [NEW]

[VOICE 1]: Pull up the Open Window file.
[VOICE 2]: Which version?
[VOICE 1]: The one we planted.
[VOICE 2]: ... Planted?
[VOICE 1]: The guest needed to find something.
            That's how we identify the curious ones.
[VOICE 2]: So the document is—
[VOICE 1]: Irrelevant. The document was the test.
            Finding it was the result.
[END TRANSMISSION]
```

```
TRANSMISSION 0003 — [CURRENT SESSION]           [NEW]

[VOICE 1]: What's the protocol for flagged guests?
[VOICE 2]: Monitor. Log. Wait.
[VOICE 1]: For how long?
[VOICE 2]: You'll know when it's enough.
[VOICE 1]: And then?
[VOICE 2]: [END TRANSMISSION]
```

The second transmission cuts off mid-conversation.
Voice 2's final line IS the end tag — they don't
answer the question. The conversation just stops.

---

## 7. COMPLIANCE PAGE — FORM DISABLED

If the visitor hasn't submitted the compliance form
yet but has accessed the secret page, the form should
display differently:

```
COMPLIANCE VERIFICATION — FORM CV-12

This verification is no longer available for
your session.

Your compliance status has been set to:

  NON-COMPLIANT — ADMINISTRATIVE OVERRIDE

This designation was applied automatically
following a clearance violation in your
current session.

Self-verification privileges have been revoked.
Your status can only be modified by the Bureau
of Internal Affairs.

No estimated timeline is available.
```

The submit button should be visible but grayed out
and unclickable. If they hover over it or try to
tab to it, play the deny sound.

---

## 8. FOOTER CHANGE

After the secret page, the footer should change from:

```
ARROW KEYS: NAVIGATE | 1-5: QUICK SELECT | ENTER: CONFIRM | ESC: [DISABLED]
```

To:

```
ARROW KEYS: NAVIGATE | 1-5: QUICK SELECT | ENTER: CONFIRM | ESC: [DENIED] | STATUS: FLAGGED
```

Subtle — ESC went from "disabled" (a design choice)
to "denied" (an active refusal). And "STATUS: FLAGGED"
just sits at the end, always visible now.

---

## IMPLEMENTATION NOTES

- All of these changes should be silent. No popups,
  no alerts, no visual transitions. The content is
  simply different now. The visitor has to notice on
  their own that the site has changed.

- The localStorage flag means these changes persist
  forever. If someone clears their browser data,
  the site resets. That's fine — they "escaped."

- The most important detail: Transmission 0002
  reframes the entire secret page as a trap. The
  classified document they found wasn't a leak —
  it was bait. The system wanted them to find it.
  That's the real twist of the site.

- Priority order for implementation:
  1. Status bar message swap (easiest, biggest impact)
  2. Boot sequence change (sets the tone on return)
  3. Your file update in Records (most personal)
  4. Transmission 0002 (the twist)
  5. Directive 0099 (reinforces consequences)
  6. Compliance form disabled (rewards exploration)
  7. System page stat changes (small but sharp)
  8. Footer change (smallest detail)
