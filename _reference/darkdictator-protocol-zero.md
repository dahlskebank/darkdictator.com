# DARKDICTATOR.COM — PROTOCOL ZERO

A hidden self-destruct mechanism that lets the visitor
wipe their flagged status and start over. Only appears
after the secret page has been accessed.

---

## TRIGGER

When `localStorage.secretAccessed === true`, a new
element appears in the footer on ALL pages:

```
ARROW KEYS: NAVIGATE | 1-5: QUICK SELECT | ENTER: CONFIRM | ESC: [DENIED] | STATUS: FLAGGED

                                              [INITIATE PROTOCOL ZERO]
```

The Protocol Zero text should be:
- Noticeably dimmer than the rest of the footer
- Same font, but smaller — around 9-10px
- No border, no button styling — just text
- Clickable, but doesn't look clickable until hover
- On hover: text brightens to full green, no other
  change — no underline, no cursor change
- On keyboard focus: same brightening behavior

It should feel like something the system left behind
by accident. Something you weren't supposed to find.
A second secret after the first.

---

## BEHAVIOR ON CLICK

1. Play the clank sound (the heavy one)

2. Screen goes fully black — all content removed
   instantly, no fade, just gone

3. After 1.5 seconds, display centered on the
   black screen in dim green, typed out slowly
   (typewriter effect):

```
PROTOCOL ZERO INITIATED.

PURGING SESSION DATA...
REMOVING CITIZEN FILE...
REVOKING FLAGGED STATUS...
REASSIGNING IDENTITY...

ALL RECORDS OF THIS SESSION HAVE BEEN DESTROYED.

YOU WERE NEVER HERE.
```

4. Each line appears one at a time with a 400ms
   delay between lines. Play a click sound with
   each new line.

5. After the final line, pause 2 seconds

6. Clear all localStorage and sessionStorage

7. Reload the page — full boot sequence starts
   fresh. New session ID. Clean slate. All pages
   back to their pre-secret-page state.

---

## POST-RESET

After Protocol Zero, the site behaves as if the
visitor has never been here before. No flagged
status, no modified records, no hostile status
messages. Population count resets. Partridge is
alive again. The compliance form is available.

The visitor can find the secret page again by
typing "obey" — and the whole cycle starts over.

---

## NOTES

- Protocol Zero should NOT appear before the
  secret page is accessed. It only exists as
  a way out once you're flagged.

- It should not be mentioned anywhere else on
  the site. No hints, no references. The visitor
  either notices the dim text in the footer or
  they don't.

- The phrase "You were never here" is the payoff.
  The whole site has been telling the visitor
  that everything is logged, everything is
  permanent, there is no escape. Protocol Zero
  is the one moment where the system lets go.
  Or appears to.
