<img width="768" height="512" alt="Image" src="https://github.com/user-attachments/assets/700d7ecb-d1e4-4b5e-bfdd-71b3e0cbbcf6" />  

# OnePromptOS
FluxyView: One Prompt OS — Framework Specification (v0.1)

Claude Shares  
[OnePromptOS Interactive Demo - First Go](https://claude.ai/public/artifacts/66362c18-756a-41fa-b39f-31c07f0414b9)
[OnePromptOS Interactive Demo - MCP Search, Runnable](https://claude.ai/public/artifacts/324e7ccb-6944-47c9-89db-761edb106d49)  
[OnePromptOS Interactive Demo - MCP Search, Claude You can Customize](https://claude.ai/public/artifacts/324e7ccb-6944-47c9-89db-761edb106d49)  

Below is a **framework specification** for **One Prompt OS** (project name: **FluxyView**) designed around your rule:

> **No forms. No pages. Only Prompt + Pixels + Actions.**

---

# FluxyView: One Prompt OS — Framework Specification (v0.1)

## Vision: Interface as Intent

> In the neon-lit corridors of 2049, interfaces have shed their chrome and widgets, replaced by conversational depth where intent flows like rain through cityscape holograms—you don't navigate pages, you navigate meaning, each spoken command or tapped gesture summoning ephemeral information planes that materialize, serve their purpose, and dissolve back into the digital ether. 

OnePromptOS embodies this post-screen paradigm: no persistent UI scaffolding cluttering your field of view, no nested menus hiding what you need six taps deep, just a single prompt bar hovering at the edge of consciousness and contextual action chips that appear like Voight-Kampff responses—immediate, purposeful, dangerous operations glowing red in the peripheral vision. Information exists in moments, not pages; each interaction is a question answered, a task completed, a decision made, then gone—the system remembers so you don't have to wade through yesterday's chrome to find tomorrow's answers. 

This is computing as it should be in an age where AI understands intent: invisible until needed, prescient without being invasive, safe by design with explicit human confirmation gates on anything that matters, voice-native but gesture-fluent, accessible to those who can't pixel-hunt through traditional UIs, and utterly formless because in the future, **the interface isn't what you see—it's what you mean.**

---

### Core Principle
**No forms. No pages. Only Prompt + Pixels + Actions.**

## 1) Product definition

**One Prompt OS** is a runtime shell where:

* **Prompt** (text/voice) is the primary interface for intent.
* **Actions** are low-cost, tappable/utterable accelerators (chips).
* **Pixels** are a disposable canvas that renders ephemeral context, previews, and results.

The system has **no persistent screens**. Every “view” is a **moment** generated on demand.

---

## 2) Core principles

* **Intent-first**: user expresses goals, not navigation.
* **Ephemeral visuals**: visuals are *projections*, never the source of truth.
* **Actionable minimalism**: show only what enables the next decision.
* **Safety by design**: risky operations require explicit confirmation.
* **Universal accessibility**: prompt + numbered actions must work without fine motor precision.

---

## 3) Shell layout contract (fixed zones)

The shell has exactly **3 persistent zones** with stable coordinates:

1. **Prompt Bar** (always visible)

* Single-line input + expand-on-demand (still “one prompt” conceptually)
* Mic button (voice in)
* “Mode crumb” (tiny status: current focus + task)
* Undo/Redo controls
* Optional: “Back / Home” controls (also available as actions)

2. **Action Strip** (always visible)

* 5–9 action chips max
* Chips may be numbered for voice (“Choose 2”)
* One primary action slot (Confirm/Run/Next)
* One escape slot (Cancel/Back)

3. **FluxyView Canvas** (disposable)

* Pixel-rendered canvas showing:

  * context
  * preview
  * diffs
  * results
  * minimal history thumbnails (optional)
* Never becomes a “page.” It’s a rendering surface only.

---

## 4) Interaction loop (the only loop)

Every turn is:

1. **Input** (prompt/voice OR action chip)
2. **Interpretation** (intent + context)
3. **Proposal** (canvas render + action chips)
4. **Commit** (explicit confirmation when required)
5. **Execution** (capability calls / state updates)
6. **Re-render** (new moment)

---

## 5) “No forms” constraint rules

To enforce “no forms,” the framework MUST:

* Never present multi-field entry.
* Collect missing info via **one question at a time** in the prompt bar.
* Prefer selection via **chips** over typing.
* If options exceed chip budget:

  * show top N chips + `[More]` + `[Search]` + `[Filter]` actions
* Any “editing” is done by:

  * “Edit X” action → prompt asks one question → re-render

---

## 6) Moment model (ephemeral UI units)

A **Moment** is a single disposable interaction state.

Moment contains:

* `moment_id`
* `focus` (what the user is currently working on)
* `canvas_frame` (pixel output, or a renderer handle)
* `action_set` (chips)
* `summary_line` (one-line “what’s happening”)
* `risk_state` (safe/confirm/dangerous)
* `audit_hint` (short human-readable execution summary)

Moments are immutable once finalized; new moments are created on each turn.

---

## 7) Action model (chips as accelerators)

An **Action** is a minimal command with policy metadata:

Action properties:

* `label` (human)
* `action_id` (stable identifier)
* `args` (typed, small)
* `tier` = `SAFE | CONFIRM | DANGEROUS`
* `speech_alias` (optional: “choose two”, “confirm”)
* `requires_focus` (optional)
* `undoable` (bool)
* `telemetry_tag` (optional)

### Risk tiers

* **SAFE**: executes immediately
* **CONFIRM**: requires an explicit confirm step (chip or phrase)
* **DANGEROUS**: requires stronger confirmation (long-press, phrase, or retype)

---

## 8) Navigation model (no pages)

Navigation is not “screens,” it’s **focus**.

Framework MUST provide:

* `Back` = pop focus stack (no execution rollback)
* `Home` = clear focus stack
* `History` = show recent moments (as thumbnails on canvas)
* `Undo` = attempt to revert last executed operation (capability-dependent)
* `Redo` = reapply last undone operation

---

## 9) Capability layer (the substrate)

All real work happens in **Capabilities**.

A capability is a typed operation with:

* `name`
* `input_schema` (typed structure, internal)
* `output_schema`
* `permissions`
* `idempotency_key` support
* `audit_log` emission
* deterministic error contracts

Framework requirement:

* The LLM/agent is **not allowed** to perform side effects directly.
* It may only request capability invocations.
* Capabilities enforce authz, validation, rate limits, and safety.

---

## 10) Agent + orchestration (intent router)

The **Intent Router**:

* Parses user input into:

  * goal
  * entities
  * missing slots
  * candidate actions
* Asks **at most one clarifying question per turn** (unless user opts into “deep mode”)
* Produces a **Plan**:

  * proposed next actions
  * required confirmations
  * capability calls (draft)

The **Orchestrator**:

* Executes capability calls
* Updates durable state
* Emits audit + telemetry
* Produces the next moment for rendering

---

## 11) Rendering system (FluxyView Canvas)

The framework supports pluggable renderers, but must expose a unified output:

### Canvas output requirements

* deterministic given `(moment_state, viewport_size, theme_tokens)`
* supports:

  * text rendering
  * icons
  * simple charts/tables (as pixels)
  * thumbnails for history moments
* optional: animations (must not hide state changes)

### Input mapping requirements

* hit testing for:

  * action chips (shell zone)
  * optional canvas hotspots (if enabled)
* voice mapping: action numbers are stable within a moment

**Important:** canvas hotspots are optional. The system must remain usable via prompt + chips alone.

---

## 12) Confirmation + commit protocol (two-phase commit)

For CONFIRM and DANGEROUS actions:

1. **Propose phase**

* render preview + audit_hint
* show `[Confirm] [Edit] [Cancel]`

2. **Commit phase**

* only on explicit confirmation:

  * execute capability
  * log commit

All commits must be auditable:

* who initiated
* what changed
* when
* what data was used
* what confirmation occurred

---

## 13) Observability requirements

Framework MUST emit:

* structured logs for:

  * moments created
  * actions proposed/executed
  * confirmations
  * capability calls + latency
  * errors + retries
* traces (request → plan → calls → render)
* redaction rules for sensitive content

---

## 14) Performance targets (framework-level)

Recommended defaults:

* **TTFP** (time to first proposal moment): < 800ms for simple local operations
* **Interaction latency** (chip tap to response): < 150ms local; < 1s typical remote
* Canvas rendering: < 16ms per frame for static updates (when client-rendered)

---

## 15) Security & safety requirements

* Hard separation:

  * agent suggests
  * substrate decides + executes
* Mandatory:

  * permission gates on capabilities
  * confirmation on side effects
  * rate limits
  * replay protection / idempotency
* UI trust:

  * shell chrome is trusted (cannot be spoofed by canvas)

---

## 16) Minimal public API surface (framework)

The framework should expose:

* `registerCapability(capability)`
* `registerPolicy(policy)`
* `registerRenderer(renderer)`
* `handlePrompt(input_text | voice_transcript)`
* `handleAction(action_id, args)`
* `getCurrentMoment()`
* `undo()` / `redo()` / `back()` / `home()`

---

## 17) Non-goals

* No multi-step forms
* No page routing
* No persistent UI layouts
* No requirement that canvas be interactive beyond display (chips + prompt are sufficient)

---

## 18) Reference interaction patterns (canonical)

Framework must support these patterns as first-class:

* **Plan → Preview → Confirm**
* **Ask-one-question slot fill**
* **Pick-from-top-N with Search/More**
* **Explain / Why / Show steps**
* **Undo where possible**
* **History thumbnails + restore focus**



