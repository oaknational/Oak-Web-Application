# TypeScript Rules

## Never use `any`

It defeats the purpose of TypeScript.

## Never use `as`

It defeats the purpose of TypeScript. NO TYPE ASSERTIONS.

## Never use `unknown`

except for data-domain boundaries to external systems.

## DO use type predicates derived from constants

Good predicate:

```typescript
// Define constants for type inference
const LABELS = ['lesson', 'unit', 'thread'] as const;
type Label = typeof LABELS[number];
const HANDLERS = [lessonHandler, unitHandler, threadHandler] as const;
type Handler = typeof HANDLERS[number];

// Define the runtime label-to-handler mapping
const LABEL_TO_HANDLER = {
  'lesson': {
    label: 'lesson',
    handler: lessonHandler,
  },
  'unit': {
    label: 'unit',
    handler: unitHandler,
  },
  'thread': {
    label: 'thread',
    handler: threadHandler,
  },
} as const;

// Derive the type of the label-to-handler mapping, preserving exact the runtime label-to-handler mapping. i.e. arbitrary labels to arbitrary handlers are disallowed in the type.
type LabelToHandler = {
  [key in typeof LABEL_TO_HANDLER]: typeof LABEL_TO_HANDLER[key]['label'] extends key ? typeof LABEL_TO_HANDLER[key] : never;
}
// Handler type preserving relationship
type CorrectHandler<key extends Label> = LabelToHandler[key]['handler'];

// Type predicate example
function isLabel(label: string): label is Label {
  const stringLabels: readonly string[] = Object.keys(LABEL_TO_HANDLER);
  return stringLabels.includes(label);
}

// Usage
function getHandler<key extends Label>(label: string): CorrectHandler<key> {
  // Runtime check for validation
  if (!isLabel(label)) {
    throw new TypeError(`Invalid label: ${label}. Allowed: ${Object.keys(LABEL_TO_HANDLER).join(', ')}`);
  }
  const handler = LABEL_TO_HANDLER[label];
  return handler;
}
```

Bad predicates:

```typescript
// Relies on type assertion
function isLabel(label: any): label is Label {
  return Object.values(LABEL_TO_HANDLER).includes(label as Label);
}

// Overly generic
function isLabel(label: string): label is Label {
  return label !== null && typeof label === 'string';
}
```

## DO use `satisfies`

To provide assurances without disabling type checking.

```typescript
type LabelName = string;
type Handler = (label: LabelName) => void;
type HandlerMap = Record<LabelName, Handler>;

const LABEL_TO_HANDLER = {
  'lesson': lessonHandler,
  'unit': unitHandler,
  'thread': threadHandler,
} satisfies HandlerMap;
```

## Do use validation libraries

Such as Zod.
