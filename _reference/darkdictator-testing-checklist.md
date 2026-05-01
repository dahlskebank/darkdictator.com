# DARKDICTATOR.COM — QA TESTING CHECKLIST

Test each item below. Check the box when verified.
Items are grouped by trigger condition.

Clear localStorage and sessionStorage before starting.

---

## A. FIRST VISIT — FRESH SESSION

### Boot sequence

[ ] Boot sequence plays with typewriter text
[ ] Click sounds play during boot text
[ ] Clank sound plays when boot completes
[ ] Random hex session ID is generated and shown
("ASSIGNING GUEST DESIGNATION: [ID]")
[ ] Session ID is stored in sessionStorage
[ ] Boot sequence only plays once per session —
navigating away and back skips it

### Top status bar

[ ] Status messages rotate from the NORMAL pool
[ ] Messages cycle on an interval

### SYSTEM page — Static content

[ ] All stats are displayed (population, directives,
rehabilitations, pre-crime, sector lockdowns, etc.)
[ ] "DAYS SINCE LAST INCIDENT: 0" is displayed
[ ] "PENDING REVIEWS: CLASSIFIED" is displayed
[ ] "You have 20 seconds to select a destination"
text is displayed

### SYSTEM page — Population countdown

[ ] Population starts at 42,661,080
[ ] Number decreases by 1-4 every 15-30 seconds
[ ] Number never increases
[ ] Number updates silently (no animation)
[ ] Navigating away and back shows the same count
(persisted in sessionStorage)

### SYSTEM page — Inactivity timer

[ ] Timer starts when SYSTEM page renders
[ ] Clicking anywhere resets the timer
[ ] Pressing any key resets the timer
[ ] Navigating to another page cancels the timer
[ ] At 20 seconds with no interaction:
[ ] Text rewrites to "You had 20 seconds..."
[ ] Deny sound plays
[ ] Text is slightly brighter than surroundings
[ ] At 30 seconds: text rewrites to "You have been
assigned a destination. Redirecting."
[ ] At 33 seconds: auto-redirect to COMPLIANCE page
[ ] Clank sound plays on redirect
[ ] COMPLIANCE page shows redirect message:
"You were redirected here due to inactivity"
[ ] Message only shows when force-redirected, NOT
when navigating to COMPLIANCE manually

### SYSTEM page — Inactivity memory

[ ] After being caught once, returning to SYSTEM shows
permanent text: "You had 20 seconds. You did not
comply. This was noted on your file."
[ ] Timer does not run again after being caught
[ ] Flag persists in sessionStorage for the session

### Navigation

[ ] Arrow keys move focus between menu items
[ ] Click sound plays when focus changes
[ ] Number keys 1-5 jump to corresponding page
[ ] Enter selects the focused page
[ ] Clank sound plays when selecting/navigating
[ ] ESC key does nothing (disabled)

### Footer

[ ] Shows: ARROW KEYS | 1-5 | ENTER | ESC: [DISABLED]
[ ] "REQUESTS THIS SESSION" counter is displayed
[ ] Counter increments on every page navigation

---

## B. AFTER VISITING 3+ PAGES

### RECORDS page — Visitor file appears

[ ] New record appears at the bottom of the list
[ ] Record uses the session ID from boot sequence
[ ] NAME shows "[PENDING IDENTIFICATION]"
[ ] STATUS shows "UNDER OBSERVATION"
[ ] NOTE says "Do not alert subject"
[ ] Record was NOT visible before 3 page views

### TRANSMISSIONS page — Session-aware transmission

[ ] Transmission 0000 appears at top marked [NEW]
[ ] Contains "The guest is still here"
[ ] Shows the ACTUAL page view count from the session
[ ] Was NOT visible before 3 page views

---

## C. DAYS SINCE LAST INCIDENT — CYCLING

Track visits to the SYSTEM page within a session:

[ ] First visit: shows 0
[ ] Second visit: shows 1
[ ] Third visit: shows 0 (with note about reset)
[ ] Fourth visit: shows 2
[ ] Fifth visit: shows 0 again

---

## D. RECORDS PAGE — PARTRIDGE MUTATION

Track visits to the RECORDS page specifically:

[ ] First visit: Partridge entry shows full details
(name, cleric, terminated, poetry note)
[ ] Second visit: Partridge entry is redacted
(████████, SEE DIRECTIVE 0071, revised note)
[ ] Third visit: Partridge entry is completely gone,
other records close the gap
[ ] Change persists in localStorage (survives
closing and reopening the browser)

---

## E. COMPLIANCE PAGE — SUBMIT BEHAVIOR

### First submission

[ ] Form displays with all checkbox statements
[ ] Submit button is clickable
[ ] After clicking submit:
[ ] Clank sound plays
[ ] Form is replaced with confirmation text
[ ] Shows session ID
[ ] Shows "Compliance status: CONDITIONAL"
[ ] "at this time" repeats three times with
each line progressively dimmer
[ ] If redirected by inactivity timer, confirmation
includes extra note about inactivity violation
and status shows "CONDITIONAL — UNDER REVIEW"

### Return visit (same session, after submitting)

[ ] Form does NOT show again
[ ] Shows: "Your verification was received"
[ ] Shows session ID
[ ] Shows "Re-verification is not available"
[ ] Shows "You will be contacted" with fading
repetition (same dimming treatment)

---

## F. SECRET PAGE

### Trigger

[ ] Typing "obey" on the keyboard (no input field,
raw keypress detection) opens the secret page
[ ] Works from any page on the site
[ ] Screen flickers/glitches on entry

### Content

[ ] Page renders in RED instead of green
[ ] All 7 suppressed findings are displayed
[ ] All 3 compromised personnel entries shown
[ ] Final note and terminal flagged warning shown
[ ] "[ESC] [DISABLED — YOU KNOW WHY]" at bottom

### Storage

[ ] localStorage.secretAccessed is set to true
[ ] Session ID is stored in localStorage (persists
across sessions permanently)

### Transmission update

[ ] After viewing secret page, navigate to TRANSMISSIONS
[ ] Transmission 0001 appears: "They found it"
/ "The document?" / "Yes"
[ ] Marked [NEW]

---

## G. POST-SECRET-PAGE CHANGES

After accessing the secret page, verify ALL of the
following changes are active. These should persist
across sessions via localStorage.

### Status bar

[ ] Rotating messages switch to FLAGGED pool:
[ ] "SESSION FLAGGED — MONITORING ELEVATED"
[ ] "YOUR COMPLIANCE STATUS HAS BEEN NOTED"
[ ] "DO NOT ATTEMPT TO ACCESS RESTRICTED FILES AGAIN"
[ ] "COUNTER-INTELLIGENCE REVIEW: PENDING"
[ ] "ALL ACTIVITY IN THIS SESSION IS BEING FORWARDED"
[ ] "SECTOR 13 — GUEST PRIVILEGES UNDER REVIEW"
[ ] "YOU WERE WARNED"
[ ] "TRUST IS A RESOURCE. YOURS HAS BEEN SPENT."
[ ] "TERMINAL INTEGRITY: COMPROMISED"
[ ] "RESUME NORMAL ACTIVITY. THIS IS A TEST."
[ ] Normal status messages no longer appear

### Boot sequence (on return visit after secret page)

[ ] Shows "CITIZEN PROFILE: FLAGGED" instead of
"NOT FOUND"
[ ] Shows "REINSTATING GUEST DESIGNATION" with
the SAME session ID from previous visit
[ ] Shows "CLEARANCE: RESTRICTED" instead of
"PROVISIONAL"
[ ] Shows "PREVIOUS SESSION VIOLATIONS ON RECORD"
[ ] Shows "MONITORING LEVEL: ELEVATED"

### SYSTEM page

[ ] "PENDING REVIEWS" changed from "CLASSIFIED"
to "1 (YOUR FILE)"
[ ] "DAYS SINCE LAST INCIDENT" permanently shows 0
with "NOTE: YOU ARE THE INCIDENT."
[ ] Normal day counter cycling is overridden

### SYSTEM page — Inactivity timer (post-secret)

[ ] If caught being inactive, text reads "Again,
you did not comply" with "pattern of
non-compliance" language

### DIRECTIVES page

[ ] Directive 0099 appears at the bottom of the list
[ ] References "guest terminal user" accessing
materials beyond clearance
[ ] Status shows "WATCHING"
[ ] Was NOT visible before accessing the secret page

### RECORDS page — Visitor file updated

[ ] Visitor's record now shows:
[ ] "STATUS: NON-COMPLIANT — CLEARANCE VIOLATION"
[ ] "PREDICTED TRAJECTORY: HOSTILE"
[ ] Note references "PROJECT: OPEN WINDOW"
[ ] Note says "Physical identification in progress"
[ ] Ends with "DO NOT ALERT SUBJECT"

### TRANSMISSIONS page

[ ] Transmission 0002 appears: "Pull up the Open
Window file" / "the one we planted" / "the
document was the test"
[ ] Transmission 0003 appears: "monitor, log, wait"
/ conversation cuts off mid-answer, Voice 2's
non-answer IS the [END TRANSMISSION] tag
[ ] Both marked [NEW]
[ ] Appear above any session-aware transmissions

### COMPLIANCE page (if not yet submitted)

[ ] Form is NOT displayed
[ ] Shows "NON-COMPLIANT — ADMINISTRATIVE OVERRIDE"
[ ] Shows "Self-verification privileges revoked"
[ ] Submit button is visible but grayed out
[ ] Hovering or tabbing to button plays deny sound
[ ] Button is not clickable

### Footer

[ ] "ESC: [DISABLED]" changed to "ESC: [DENIED]"
[ ] "STATUS: FLAGGED" appended to end of footer

### Protocol Zero

[ ] "[INITIATE PROTOCOL ZERO]" text appears in footer
[ ] Text is dimmer and smaller than surrounding footer
[ ] Text is NOT visible before secret page is accessed
[ ] On hover: text brightens to full green
[ ] On keyboard focus: same brightening

---

## H. PROTOCOL ZERO — EXECUTION

[ ] Clicking Protocol Zero:
[ ] Clank sound plays
[ ] Screen goes fully black instantly
[ ] After 1.5 seconds, purge sequence begins
[ ] Text types out line by line (typewriter):
"PROTOCOL ZERO INITIATED."
"PURGING SESSION DATA..."
"REMOVING CITIZEN FILE..."
"REVOKING FLAGGED STATUS..."
"REASSIGNING IDENTITY..."
"ALL RECORDS OF THIS SESSION HAVE BEEN DESTROYED."
"YOU WERE NEVER HERE."
[ ] Click sound plays with each new line
[ ] 400ms delay between lines
[ ] 2-second pause after final line
[ ] localStorage is cleared
[ ] sessionStorage is cleared
[ ] Page reloads automatically

### Post-reset verification

[ ] Full boot sequence plays again
[ ] NEW session ID is generated (different from before)
[ ] All status messages are back to normal pool
[ ] SYSTEM page shows default stats (population
reset, "PENDING REVIEWS: CLASSIFIED", etc.)
[ ] DIRECTIVES page: Directive 0099 is gone
[ ] RECORDS page: visitor file is gone
[ ] RECORDS page: Partridge is back (if was deleted)
[ ] TRANSMISSIONS page: session-aware and post-secret
transmissions are gone
[ ] COMPLIANCE page: form is available again
[ ] Footer shows "ESC: [DISABLED]" (not "DENIED")
[ ] Protocol Zero text is gone from footer
[ ] "REQUESTS THIS SESSION" counter resets to 0
[ ] Typing "obey" works again — full cycle can repeat

---

## I. 404 PAGE

[ ] CRT styling matches main site (scanlines, glow, font)
[ ] Shows "ERROR 404 — FILE NOT FOUND"
[ ] Shows "It has never existed"
[ ] Shows "The system does not make errors"
[ ] Shows session ID
[ ] Shows "Remaining here is also logged"
[ ] If secret page was previously accessed,
post-secret status bar and footer are active

---

## J. 403 PAGE

[ ] CRT styling matches main site
[ ] Shows "ERROR 403 — ACCESS DENIED"
[ ] Shows "VIOLATION CLASS: AMBER"
[ ] Shows "You have been reminded"
[ ] Shows "This is not a suggestion"
[ ] If secret page was previously accessed,
post-secret status bar and footer are active

---

## K. SOUND EFFECTS

[ ] Click sound — plays on navigation focus changes,
typewriter text, key presses
[ ] Clank sound — plays on page selection, submit
actions, Protocol Zero initiation, forced redirect
[ ] Deny sound — plays on inactivity timer trigger,
hovering/tabbing to disabled compliance button
[ ] Boot sound — plays during boot sequence

---

## L. CROSS-SESSION PERSISTENCE

Close the browser completely, reopen the site:

[ ] If secret page was accessed: all post-secret
changes are still active
[ ] Session ID is the same as before (from localStorage)
[ ] Partridge mutation state is preserved
[ ] Compliance form state is preserved (if submitted)
[ ] Population count resets (sessionStorage only)
[ ] Page view counter resets (sessionStorage only)
[ ] Inactivity caught flag resets (sessionStorage only)
[ ] Session-aware transmissions reset (sessionStorage)

After Protocol Zero + close + reopen:

[ ] Everything is fully reset
[ ] Site behaves as a completely fresh first visit
