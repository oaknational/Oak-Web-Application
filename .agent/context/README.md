# Project Documentation System

**Purpose:** This directory contains the documentation system for continuing complex, multi-session development work with AI assistants across fresh chat contexts.

**This README documents the SYSTEM itself** - how the three core documents work together.

---

## 📋 The Three-Document System

This system uses three complementary documents to enable seamless context switching between AI chat sessions:

### 1. **`HANDOFF.md`** - Orientation Hub 🗺️

**Audience:** Humans + new AI contexts  
**Purpose:** Big-picture orientation and document navigation

**Contains:**

- Where we are (phase/session status - high level)
- Document map (where to find everything)
- Quick start (how to begin work)
- Architecture overview (visual/high-level)
- Key deliverables (what exists now)
- Common patterns (quick reference)
- Success criteria (how to know you're done)

**Update when:**

- After MILESTONES (phase/major session complete)
- Quality gates change significantly
- Document structure changes
- Key deliverables are completed

**Characteristics:**

- Scannable orientation guide
- Welcoming and navigational
- Visual/high-level architecture
- Quick reference for patterns
- ~250-300 lines typical
- Read time: ~5-10 minutes

**Think:** "README for current work" or "Onboarding guide"  
**Question answered:** "Where am I?"

---

### 2. **`continuation.prompt.md`** - AI Rehydration 🤖

**Audience:** AI assistants in fresh contexts (not for human reading)  
**Purpose:** Complete AI context restoration with full history

**Contains:**

- Complete prompt structure ("I'm working on...")
- Full historical record (all sessions with details)
- Architectural decisions with "why" and trade-offs
- Type system detailed architecture
- All objectives (comprehensive checklists)
- Execution workflow (step-by-step procedures)
- Non-negotiables (complete rules reference)
- Critical patterns with examples
- Anti-patterns to avoid

**Update when:**

- After EACH SESSION (add to historical record)
- Architectural decisions are made
- New patterns emerge
- Important insights are discovered
- Trade-offs are accepted

**Characteristics:**

- Comprehensive and complete
- Optimized for AI consumption
- Formal, procedural tone
- Includes "why" behind all decisions
- Unlimited length (completeness over brevity)
- Not optimized for human reading

**Think:** "Structured brief for programmatic context loading"  
**Question answered:** "What's everything?"

---

### 3. **`context.md`** - Living Status Log 📝

**Audience:** Everyone (humans + AI) for quick status check  
**Purpose:** Session-by-session changelog + current status

**Contains:**

- Right now (current task, immediate next actions)
- Current blockers (if any)
- Active decisions (under consideration)
- Quality gate status (current health with timestamps)
- Session log (recent work, chronological)
- Recent wins (last 2-4 sessions)

**Update when:**

- After EVERY WORK SESSION (daily/hourly)
- Quality gates are run
- Blockers emerge or resolve
- Next actions change
- Session transitions occur

**Characteristics:**

- Factual, chronological changelog
- Focus on RECENT activity (not full history)
- Quick status check
- Always current (living document)
- ~150-200 lines typical
- Read time: ~2-3 minutes

**Think:** "Session log" or "Daily standup notes"  
**Question answered:** "What changed recently?"

---

## 📊 Clear Separation Matrix

| Aspect           | `context.md`      | `HANDOFF.md`    | `continuation_prompt.md` |
| ---------------- | ----------------- | --------------- | ------------------------ |
| **Purpose**      | Session changelog | Orientation hub | AI rehydration           |
| **Audience**     | Everyone          | Humans + AI     | AI only                  |
| **Update After** | Every session     | Milestones      | Each session             |
| **Length**       | ~150-200 lines    | ~250-300 lines  | Unlimited                |
| **Focus**        | Recent changes    | Big picture     | Complete history         |
| **Time to Read** | 2-3 min           | 5-10 min        | Reference only           |
| **Optimization** | Recency           | Scannability    | Completeness             |
| **Question**     | "What changed?"   | "Where am I?"   | "What's everything?"     |
| **Tone**         | Factual log       | Welcoming guide | Formal brief             |

---

## 🚀 Usage Examples

### Starting Fresh Session (Cold Start)

When resuming work in a completely fresh AI chat with no prior context:

```text
I'm continuing development on openapi-zod-client. Please read these documents:

@HANDOFF.md
@continuation_prompt.md
@context.md
@PHASE-2-MCP-ENHANCEMENTS.md
@RULES.md

Once you've read them, please:
1. Summarize the current state
2. Identify the next session to work on
3. Enter planning mode and create a detailed implementation plan with:
   - Specific tasks broken down into steps
   - Acceptance criteria for each task
   - Validation steps to confirm completion
   - Estimated effort per task

Follow all standards in @RULES.md including TDD, type safety, and comprehensive TSDoc.
```

**What happens:**

- AI reads `HANDOFF.md` → gets big picture orientation (5 min)
- AI reads `continuation_prompt.md` → understands full technical context with history
- AI reads `context.md` → knows recent changes and current status
- AI reads plan document → knows session objectives and acceptance criteria
- AI reads `RULES.md` → knows quality standards (TDD, TSDoc, etc.)
- AI creates detailed implementation plan for the session
- AI can begin work immediately with full context

**Note:** You can skip `HANDOFF.md` if you're short on time and jump straight to `continuation_prompt.md` + `context.md`, but HANDOFF provides helpful orientation for complex projects.

---

### Mid-Session Resume (Warm Start)

When returning to work in the same session after a break:

```text
I'm back. What were we working on, and what's the status?
```

**What happens:**

- AI uses existing chat history (context still loaded)
- AI can reference recent work directly
- No need to reload documentation
- Can continue immediately

---

### Session Completion & Handoff

When completing a session and preparing for next session:

```
Excellent work. Please update the documentation for handoff:

1. Update @context.md:
   - Add session to Session Log with what changed
   - Update "Right Now" section for next session
   - Update quality gate status with timestamps
   - Note any new blockers or active decisions

2. Update @continuation_prompt.md:
   - Add any new architectural insights to "Architectural Decisions"
   - Document critical decisions made with rationale
   - Add new patterns or anti-patterns discovered
   - Update "What's Next" section

3. Update @PHASE-2-MCP-ENHANCEMENTS.md:
   - Mark Session X as COMPLETE
   - Add completion date and duration
   - Record validation results (type/lint/test status)
   - List all deliverables

4. Update @HANDOFF.md (if milestone reached):
   - Update phase progress overview
   - Update key deliverables section
   - Update quality gate status
   - Add any new common patterns

5. Commit all changes with a comprehensive commit message
```

**What happens:**

- `context.md` updated with session changelog (updated EVERY session)
- `continuation_prompt.md` updated with new insights (updated EVERY session)
- Plan document marked complete with results
- `HANDOFF.md` updated if milestone reached (updated at MILESTONES only)
- Next AI session will have complete context
- Commit preserves all work and context
- System is ready for next session (cold start)

---

### Planning New Work

When starting a new phase or major feature:

```text
I want to add [NEW FEATURE]. Please:

1. Read the current documentation:
   @HANDOFF.md
   @continuation.prompt.md
   @context.md
   @RULES.md

2. Analyze the feature requirements
3. Create a detailed plan document in .agent/plans/
4. Break down into sessions with acceptance criteria
5. Identify dependencies and risks
6. Estimate effort per session
7. Update @context.md with the new plan
8. Update @HANDOFF.md with the new phase in roadmap
```

**What happens:**

- AI reads `HANDOFF.md` → understands current project state and deliverables
- AI reads `continuation_prompt.md` → understands existing architecture and patterns
- AI reads `context.md` → knows recent work and current status
- AI reads `RULES.md` → knows quality standards to follow
- AI creates new plan document following established format
- Plan is integrated into documentation system
- `HANDOFF.md` updated with new phase
- Ready to begin implementation

---

## 🔄 Documentation Workflow

### Daily/Session Workflow (EVERY session)

```text
┌─────────────────────┐
│  Start New Session  │
│  (Read docs)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Work on Tasks      │
│  (Implement)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Run Quality Gates  │
│  (type/lint/test)   │
└──────────┬──────────┘
           │
           ▼
┌────────────────────────┐
│  Update context.md     │
│  (Add to session log)  │
└──────────┬─────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Update continuation_prompt  │
│  (Add insights if any)       │
└──────────┬───────────────────┘
           │
           ▼
┌─────────────────────┐
│  Commit Work        │
└─────────────────────┘
```

**Update every session:**

- ✅ `context.md` - Add to session log, update "Right Now", update quality gates
- ✅ `continuation_prompt.md` - Add new insights, patterns, or decisions (if any)
- ⚠️ Plan document - Mark tasks complete as you go

---

### Session Completion Workflow (End of EACH session)

```text
┌─────────────────────────┐
│  Complete All Tasks     │
│  (Session done)         │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Run Quality Gates      │
│  (Verify all green)     │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Update context.md      │
│  (Session complete)     │
└──────────┬──────────────┘
           │
           ▼
┌────────────────────────────────┐
│  Update continuation_prompt.md │
│  (Add session to history)      │
└──────────┬─────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Update Plan Doc        │
│  (Mark session COMPLETE)│
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Commit with Summary    │
└─────────────────────────┘
```

**Update after each session:**

- ✅ `context.md` - Session log entry, next actions, blockers
- ✅ `continuation_prompt.md` - Architectural insights, decisions, patterns
- ✅ Plan document - Mark session complete with validation results
- ❌ `HANDOFF.md` - NOT updated (wait for milestone)

---

### Milestone Completion Workflow (After MAJOR sessions/phases)

```text
┌─────────────────────────┐
│  Major Milestone Done   │
│  (Phase/part complete)  │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Comprehensive Testing  │
│  (All quality gates)    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Documentation Sweep    │
│  (TSDoc, examples, etc) │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Update ALL Docs        │
│  (Including HANDOFF)    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Milestone Commit       │
└─────────────────────────┘
```

**Update at milestones:**

- ✅ `context.md` - Updated as usual
- ✅ `continuation_prompt.md` - Updated as usual
- ✅ Plan document - Updated as usual
- ✅ **`HANDOFF.md`** - NOW update (phase progress, deliverables, architecture)

---

## 📁 Directory Structure

```text
.agent/
├── context/
│   ├── README.md                    ← This file
│   ├── continuation.prompt.md       ← AI rehydration prompt
│   ├── context.md                   ← Living status document
├── plans/
│   ├── some_plan.md  ← Current plan
│   └── [future-plans].md
├── architecture/
│   ├── architecture.md           ← Architecture docs for agents
│   └── [other-arch-docs].md
└── RULES.md                         ← Coding standards
```

---

## 🎯 Design Principles

### 1. **Separation of Concerns**

- Each document has ONE clear purpose
- No overlap or duplication
- Easy to find information

### 2. **Optimized for Different Audiences**

- `continuation.prompt.md` → AI technical context
- `context.md` → Quick human + AI status
- Plan docs → Structured session planning

### 3. **Progressive Disclosure**

- Start with `context.md` (quick scan)
- Read `continuation.prompt.md` (full context)
- Reference plan docs (detailed work breakdown)

### 4. **Living Documentation**

- Always up-to-date
- Updated as work progresses
- Reflects current reality, not aspirations

### 5. **AI-First Design**

- Optimized for AI consumption and comprehension
- Clear structure and formatting
- Explicit context and relationships
- Self-contained sections

---

## ✅ Quality Checklist

Before starting a new session, verify:

- [ ] `continuation.prompt.md` reflects all major decisions
- [ ] `context.md` shows current state accurately
- [ ] Plan document has clear next session
- [ ] Quality gate status is accurate
- [ ] All recent work is committed
- [ ] Architecture docs are up-to-date

Before completing a session, verify:

- [ ] Plan document marked COMPLETE with results
- [ ] `continuation.prompt.md` updated with insights
- [ ] `context.md` updated with next actions
- [ ] All quality gates passing (type/lint/test)
- [ ] All changes committed with good messages
- [ ] Documentation is accurate and current

---

## 🔍 Troubleshooting

### AI seems confused about current state

**Solution:** Ensure `context.md` is up-to-date and accurately reflects status

### AI doesn't understand architectural decisions

**Solution:** Check `continuation.prompt.md` has sufficient background and "why" behind decisions

### AI creates poor implementation plans

**Solution:** Review plan document format and ensure RULES.md is referenced

### Documentation feels stale

**Solution:** Update after each significant work session, not just at boundaries

### Too much duplication between docs

**Solution:** Review separation of concerns - each doc should have ONE clear purpose

---

## 📚 Additional Resources

- **Coding Standards:** `.agent/RULES.md`
- **Architecture Docs:** `.agent/architecture/`
- **Plan Documents:** `.agent/plans/`
- **Project README:** `../README.md`

---

## 🔄 Document Maintenance

### When to Archive

Archive documents when:

- Phase is complete and unlikely to be referenced
- Document is superseded by newer version
- Historical reference only (not active work)

Archive location: `.agent/context/archive/`

### When to Create New Plan Document

Create new plan document when:

- Starting a new major phase
- Significant scope change requires new structure
- Previous plan document is complete

Naming: `PHASE-N-FEATURE-NAME.md`

---

**Last Updated:** November 14, 2025  
**System Version:** 1.0  
**Status:** Active
