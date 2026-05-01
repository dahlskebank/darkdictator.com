# DARKDICTATOR.COM — INACTIVITY TIMER

The "You have 20 seconds" line on the SYSTEM page
is not decorative. It's a real countdown with real
consequences.

---

## LOCATION

SYSTEM page (home), at the bottom of the main
content block. The line currently reads:

```
You have 20 seconds to select a destination.
Inactivity will be noted.
```

---

## BEHAVIOR

The timer starts when the SYSTEM page finishes
rendering (after boot sequence on first load, or
immediately on subsequent visits).

### Phase 1 — Countdown (0-20 seconds)

No visible countdown. The text just sits there.
The visitor either acts or doesn't.

If the visitor navigates to any other page before
20 seconds: timer cancelled, nothing happens.
Normal behavior. Good citizen.

### Phase 2 — First warning (20 seconds)

The text silently rewrites. No animation, no flash.
One frame it says one thing, the next frame it says
another:

```
You had 20 seconds. You did not comply.
This has been noted on your file.
Select a destination now.
```

Play one single low beep (use the deny sound).

The text color shifts slightly brighter than the
surrounding content — not red, not flashing, just
a nudge more visible. Like the system raised its
voice slightly.

### Phase 3 — Final warning (30 seconds)

Text rewrites again:

```
You have been assigned a destination.
Redirecting.
```

### Phase 4 — Forced redirect (33 seconds)

After 3 seconds of showing the redirect message,
auto-navigate to the COMPLIANCE page.

Play the clank sound on redirect.

On the COMPLIANCE page, prepend a line above the
form that only appears when the visitor was
force-redirected:

```
You were redirected here due to inactivity
on the SYSTEM terminal. Complete this form
to restore standard access privileges.
```

Store a flag in sessionStorage:
`forcedToCompliance: true`

This line only shows when that flag is present.
If the visitor navigates to COMPLIANCE on their
own, it does not appear.

---

## RESET CONDITIONS

The timer resets if the visitor:
- Navigates to any other page (timer cancelled)
- Clicks anywhere on the page (timer resets to 0)
- Presses any key (timer resets to 0)

The timer only runs on the SYSTEM page. Other
pages do not have inactivity monitoring.

If the visitor navigates away and comes back to
the SYSTEM page, the timer starts fresh — BUT
the text immediately shows the Phase 2 version
("You had 20 seconds") if they were already
caught being inactive in this session. The system
remembers.

Track in sessionStorage: `inactivityCaught: true`

If `inactivityCaught` is true, the SYSTEM page
always shows:

```
You had 20 seconds. You did not comply.
This was noted on your file.
Select a destination.
```

No timer runs again. They already failed. No
second chances.

---

## INTERACTION WITH SECRET PAGE FLAG

If the visitor has accessed the secret page
(localStorage.secretAccessed === true) AND they
get caught by the inactivity timer, the Phase 2
text should instead read:

```
You had 20 seconds. Again, you did not comply.
Your pattern of non-compliance has been noted.
Select a destination. This will not be repeated.
```

The "again" and "pattern" imply the system is
building a case. Layering offenses.

---

## INTERACTION WITH FORCED COMPLIANCE

If the visitor is force-redirected to COMPLIANCE
and then submits the form, the confirmation text
should include an extra line:

```
NOTE: This verification was prompted by an
inactivity violation. Compliance status has
been adjusted accordingly.
```

Their compliance status should read:

```
Compliance status: CONDITIONAL — UNDER REVIEW
```

Instead of the normal:

```
Compliance status: CONDITIONAL
```

---

## NOTES

- The entire point is that the site told them
  exactly what would happen. 20 seconds. It was
  right there. And they didn't listen.

- The forced redirect to COMPLIANCE is the punchline.
  The regime doesn't punish you with violence — it
  punishes you with paperwork.

- Do NOT show any visible countdown timer. No
  numbers ticking down. The visitor has to feel
  the 20 seconds pass in real time with no help.
  The tension is in not knowing exactly when the
  system will act.
