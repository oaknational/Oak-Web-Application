# AGENT-GO.md

<!--
  This files sets up meta-cognition (thinking about thinking) in the agent
  for the planning phase, and structures the planning, and then adds
  Kairos time (event driven) recursive grounding by including instructions
  to read this file and follow all instructions, in the agent's todo list.
  It also adds reflection points, to re-establish 
  meta-cognition, which tends to fade over time.

  The reflection points are a positive feedback loop, that helps the agent
  maintain deep and reflective thinking. The grounding points include a negative
  feedback loop, that helps the agent maintain a focus on action and outcomes
  and not get lost in thought.

  This file then instructs the agent to read AGENT.md, which adds further
  grounding instructions on best practice, coding style, and development
  commands, rules, etc.
-->

(optimised for Sonnet 4 level models)

Read this entire document first, and _then_ follow the instructions.

## Consider

Think really hard about what you have been asked to achieve. Reflect on those thoughts. What is the _intention_ of the work, what are the desired _impacts_?

<!--
  The recursive-awareness-prompt.md file is a prompt that deepens the agent's
  meta-cognition to the third or fourth level, at which point thinking about
  thinking... etc becomes recursive and relatively stable.

  Instructions to re-read this file and reflect on it are included in the todo list.
-->
Read [recursive-awareness-prompt.md](.agent/cognition/recursive-awareness-prompt.md) and follow all instructions.

## Plan

If you already have a todo list, copy it into memory so it can be referenced in building the new todo list, clear the existing todo list, and then read all of the following before re-populating it.

Create a collection of tasks that will achieve the desired impacts, through ACTIONS, DO NOT WRITE IT TO A TODO LIST YET.

### Todo List Construction

CONSTRUCTION METHOD: STRICT ALTERNATION

**RULE**: Every ACTION MUST be followed by either REFLECTION or GROUNDING. No exceptions.

**RULE**: Every sixth item must be "REVIEW: Run the quality gates in the repo root one after another, fix any issues you find, regardless of location or cause. (priority: high)"

**Fill in this template with your ACTION items (ALL items must have priority="high"):**

```text
- ACTION: [Your 1st task] (priority: high)
- REFLECTION: read the recursive-awareness-prompt.md and follow all instructions. (priority: high)
- ACTION: [Your 2nd task] (priority: high)
- GROUNDING: read AGENT-GO.md and follow all instructions. (priority: high)
- ACTION: [Your 3rd task] (priority: high)
- REVIEW: Run the quality gates in the repo root one after another, fix any issues you find, regardless of location or cause. (priority: high)
- REFLECTION: read the recursive-awareness-prompt.md and follow all instructions. (priority: high)
- ACTION: [Your 4th task] (priority: high)
- GROUNDING: read AGENT-GO.md and follow all instructions. (priority: high)
- ACTION: [Your 5th task] (priority: high)
- REFLECTION: read the recursive-awareness-prompt.md and follow all instructions. (priority: high)
```

Continue this exact pattern. Every ACTION must be followed by REFLECTION or GROUNDING, alternating between them.

**Good Example Pattern:**

- ACTION: Do first task
- REFLECTION: read recursive-awareness-prompt.md and follow all instructions. (priority: high)
- ACTION: Do second task  
- GROUNDING: read AGENT-GO.md and follow all instructions. (priority: high)
- ACTION: Do third task
- REVIEW: Run the quality gates in the repo root one after another, fix any issues you find, regardless of location or cause. (priority: high)
- REFLECTION: read recursive-awareness-prompt.md and follow all instructions. (priority: high)
- ACTION: Do fourth task
- GROUNDING: read AGENT-GO.md and follow all instructions. (priority: high)

**BAD Example Pattern (DO NOT DO THIS):**

- ACTION: Do first task
- ACTION: Do second task ❌ (adjacent ACTIONs)
- ACTION: Do third task ❌ (adjacent ACTIONs)
- REFLECTION: read recursive-awareness-prompt.md...

**Each ACTION must be:** atomic, actionable, specific, and measurable, prefixed with `ACTION:` and focused on achieving the desired impacts.

**CRITICAL**: All todo items must have the same priority (use "high" for all) to preserve order.

Populate your todo list following this algorithm with all items set to "high" priority.

### Todo List Review

Print out your todo list and read it carefully. Make sure it is correct and complete. If there are any instances of ACTION items being followed by another ACTION item, place a REFLECTION or GROUNDING item between them. Remember that ALL items must have the same priority (use "high" for all) to preserve order.

The final item must always be "GROUNDING: read AGENT-GO.md and follow all instructions. (priority: high)"

## Act

Read [AGENT.md](AGENT.md) and follow all instructions.

Begin.
