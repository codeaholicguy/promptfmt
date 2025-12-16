# promptfmt

A composable prompt formatting library with runtime parameter substitution and conditional logic.

## Features

- **Component-based architecture**: Build prompts from composable components (role, goal, input, output, context, persona, tone, few-shots, guardrails, constraints, tasks, steps)
- **Runtime parameter substitution**: Use template strings with `${paramName}` syntax
- **Conditional logic**: Include/exclude components based on runtime conditions
- **Fluent API**: Chain methods for intuitive prompt building
- **Type-safe**: Full TypeScript support

## Installation

```bash
npm install promptfmt
```

## Quick Start

```typescript
import { PromptBuilder, createCondition } from 'promptfmt';

const prompt = new PromptBuilder()
  .role('You are a wise numerology guide')
  .goal('Generate a numerology interpretation for ${userName}')
  .input({
    name: '${userName}',
    birthday: '${birthday}',
    numberType: '${numberType}',
    numberValue: '${numberValue}'
  })
  .persona((params) => {
    if (params.age > 10) {
      return 'The Steady Anchor persona';
    }
    return 'The Clear Mirror persona';
  })
  .output('Write ${maxSentences} sentences')
  .constraints('Do not include predictions')
  .build({ 
    userName: 'John',
    birthday: '1990-01-01',
    numberType: 'lifePath',
    numberValue: 5,
    age: 34,
    maxSentences: 10
  });
```

## Component Types

### Role
Defines the AI's role/identity.

```typescript
builder.role('You are a helpful assistant');
```

### Goal
Defines the objective of the prompt.

```typescript
builder.goal('Answer user questions');
```

### Input
Defines input data/parameters. Can accept strings or objects.

```typescript
// String format
builder.input('Question: ${question}');

// Object format (auto-formatted with "- key: value")
builder.input({
  name: '${userName}',
  age: '${age}',
  metadata: { key: 'value' } // Non-string values are JSON.stringify'd
});
// Results in:
// "- name: John
// - age: 25
// - metadata: {\"key\":\"value\"}"
```

### Output
Defines expected output format/requirements.

```typescript
builder.output('Write ${maxSentences} sentences');
```

### Context
Provides background information.

```typescript
builder.context('Today is ${date}');
```

### Persona
Defines character/personality traits.

```typescript
builder.persona('The Steady Anchor persona');
```

### Tone
Defines communication style.

```typescript
builder.tone('Warm and supportive');
```

### Few-shots
Provides example inputs/outputs. Can accept an array of strings which will be automatically formatted as "Example 1:", "Example 2:", etc.

```typescript
// Using array (auto-formatted)
builder.fewShots([
  'Input: Hello\nOutput: Hi there!',
  'Input: How are you?\nOutput: I am doing well, thank you!'
]);
// Results in: "Example 1:\nInput: Hello\nOutput: Hi there!\n\nExample 2:\n..."

// Using string (manual formatting)
builder.fewShots('Example 1: ...');

// Using function that returns array
builder.fewShots((params) => {
  return ['Example one', 'Example two'];
});
```

### Guardrails
Defines safety/behavior boundaries. Can accept an array of strings which will be automatically prefixed with "-".

```typescript
// Using array (auto-prefixed)
builder.guardrails([
  'Do not provide medical advice',
  'Do not share personal information',
  'Always verify facts'
]);
// Results in: "- Do not provide medical advice\n- Do not share personal information\n- Always verify facts"

// Using string (manual formatting)
builder.guardrails('Do not provide medical advice');

// Using function that returns array
builder.guardrails((params) => {
  return ['Rule one', 'Rule two'];
});
```

### Constraints
Defines limitations/rules. Can accept an array of strings which will be automatically prefixed with "-".

```typescript
// Using array (auto-prefixed)
builder.constraints([
  'Maximum 500 words',
  'Response time under 2 minutes',
  'Use simple language'
]);
// Results in: "- Maximum 500 words\n- Response time under 2 minutes\n- Use simple language"

// Using string (manual formatting)
builder.constraints('Maximum 500 words');

// Using function that returns array
builder.constraints((params) => {
  return ['Constraint one', 'Constraint two'];
});
```

### Tasks
Defines list of tasks to perform. Can accept an array of strings which will be automatically prefixed with "1.", "2.", etc.

```typescript
// Using array (auto-prefixed)
builder.tasks([
  'Analyze the input',
  'Generate response',
  'Validate output'
]);
// Results in: "1. Analyze the input\n2. Generate response\n3. Validate output"

// Using string (manual formatting)
builder.tasks('1. Analyze the input\n2. Generate response');

// Using function that returns array
builder.tasks((params) => {
  return ['Task one', 'Task two'];
});
```

### Steps
Defines sequential steps to follow. Can accept an array of strings which will be automatically prefixed with "Step 1:", "Step 2:", etc.

```typescript
// Using array (auto-prefixed)
builder.steps([
  'Understand the requirements',
  'Break down into tasks',
  'Execute each task'
]);
// Results in: "Step 1: Understand the requirements\nStep 2: Break down into tasks\nStep 3: Execute each task"

// Using string (manual formatting)
builder.steps('Step 1: ...\nStep 2: ...');

// Using function that returns array
builder.steps((params) => {
  return ['Step one', 'Step two'];
});
```

## Parameter Substitution

Use `${paramName}` syntax in template strings:

```typescript
builder.role('Hello ${name}, you are ${age} years old');
const result = builder.build({ name: 'John', age: 25 });
// Result: "Hello John, you are 25 years old"
```

**Missing Parameters**: If a parameter is missing, null, or undefined, the placeholder is kept as-is (allows for optional parameters):

```typescript
builder.role('Hello ${name}');
const result = builder.build({}); // No params provided
// Result: "Hello ${name}" (placeholder preserved)
```

**Non-string Values**: Non-string values are automatically converted to strings:

```typescript
builder.role('Age: ${age}, Active: ${active}');
const result = builder.build({ age: 25, active: true });
// Result: "Age: 25, Active: true"
```

You can also use functions for dynamic content:

```typescript
builder.role((params) => {
  return `Hello ${params.name}, you are ${params.age} years old`;
});
```

## Conditional Logic

Include/exclude components based on runtime conditions:

```typescript
import { createCondition, RoleComponent, GoalComponent } from 'promptfmt';

builder.goal('Goal A', {
  condition: createCondition(
    (params) => params.age > 18,
    new GoalComponent('Adult Goal'),
    new GoalComponent('Child Goal')
  )
});

// If age > 18, includes "Adult Goal", otherwise includes "Child Goal"
const result = builder.build({ age: 25 });
```

**Multiple Components in Conditions**: You can include multiple components in the `then` or `else` clauses:

```typescript
builder.role('Base role', {
  condition: createCondition(
    (params) => params.userType === 'premium',
    [
      new RoleComponent('Premium role'),
      new ContextComponent('Premium context')
    ],
    new RoleComponent('Standard role')
  )
});
```

**Conditional Logic Without Else**: If no `else` clause is provided and the condition is false, the component is excluded:

```typescript
builder.goal('Optional goal', {
  condition: createCondition(
    (params) => params.includeGoal === true,
    new GoalComponent('Optional goal')
    // No else clause - component excluded if condition is false
  )
});
```

## Component Ordering

Control the order of components:

```typescript
builder.goal('Goal', { order: 2 });
builder.role('Role', { order: 1 });
builder.input('Input', { order: 3 });

// Components will appear in order: Role, Goal, Input
```

**Ordering Rules**:
- Components with lower order numbers appear first
- Components without an explicit order come after ordered components, maintaining their insertion order
- If no order is specified, components appear in the order they were added

## Custom Labels

Add custom labels to components:

```typescript
builder.role('You are a helper', { label: 'System Role' });
```

## Advanced Usage

### Adding Custom Components

All component classes are available for direct instantiation:

```typescript
import { 
  RoleComponent, 
  GoalComponent, 
  InputComponent, 
  OutputComponent,
  ContextComponent,
  PersonaComponent,
  ToneComponent,
  FewShotsComponent,
  GuardrailsComponent,
  ConstraintsComponent,
  TasksComponent,
  StepsComponent,
  BaseComponent
} from 'promptfmt';

const customComponent = new RoleComponent('Custom role');
builder.addComponent(customComponent);
```

### BaseComponent

The `BaseComponent` class provides a base for all components and includes a `clone` method:

```typescript
import { BaseComponent, ComponentType } from 'promptfmt';

const component = new BaseComponent(ComponentType.ROLE, 'You are a helper');
const cloned = component.clone({ label: 'Custom Label' });
// Creates a copy with updated properties
```

### Multiple Components

```typescript
builder.addComponents([
  new RoleComponent('Role 1'),
  new GoalComponent('Goal 1'),
]);
```

### Clearing Components

```typescript
builder.clear();
```

### Empty Components

Empty components (with no content after parameter substitution) are automatically skipped during rendering.

## API Reference

### PromptBuilder

Main class for building prompts.

#### Methods

- `role(content, options?)` - Add role component
- `goal(content, options?)` - Add goal component
- `input(content, options?)` - Add input component
- `output(content, options?)` - Add output component
- `context(content, options?)` - Add context component
- `persona(content, options?)` - Add persona component
- `tone(content, options?)` - Add tone component
- `fewShots(content, options?)` - Add few-shots component
- `guardrails(content, options?)` - Add guardrails component
- `constraints(content, options?)` - Add constraints component
- `tasks(content, options?)` - Add tasks component
- `steps(content, options?)` - Add steps component
- `addComponent(component)` - Add custom component
- `addComponents(components)` - Add multiple components
- `getComponents()` - Get all components
- `clear()` - Clear all components
- `build(params?)` - Build final prompt string. `params` is optional (defaults to `{}`). Missing parameters in template strings will keep their placeholders.

### Utilities

#### Parameter Substitution

```typescript
import { 
  substitute, 
  resolveContent,
  extractParameters, 
  validateParameters 
} from 'promptfmt';

// Substitute parameters in a template string
substitute('Hello ${name}', { name: 'John' }); // "Hello John"

// Resolve content (handles strings, template strings, or functions)
resolveContent('Hello ${name}', { name: 'John' }); // "Hello John"
resolveContent((params) => `Hello ${params.name}`, { name: 'John' }); // "Hello John"

// Extract parameter names from a template
extractParameters('Hello ${name}, age ${age}'); // ["name", "age"]

// Validate parameters (returns missing parameter names)
validateParameters('Hello ${name}', { name: 'John' }); // [] (no missing params)
validateParameters('Hello ${name}', {}); // ["name"] (missing params)

// Validate with strict mode (throws error if params missing)
validateParameters('Hello ${name}', {}, true); 
// Throws: Error("Missing required parameters: name")
```

#### Conditional Logic

```typescript
import { 
  createCondition, 
  evaluateCondition,
  filterComponentsByCondition 
} from 'promptfmt';
import { RoleComponent, PromptComponent } from 'promptfmt';

// Create a condition
const condition = createCondition(
  (params) => params.age > 18,
  new RoleComponent('Adult'),
  new RoleComponent('Child')
);

// Evaluate a condition and get components to include
const components = evaluateCondition(condition, { age: 25 });
// Returns: [RoleComponent('Adult')]

// Filter an array of components based on their conditions
const allComponents: PromptComponent[] = [/* ... */];
const activeComponents = filterComponentsByCondition(allComponents, { age: 25 });
// Returns only components that pass their conditions
```

#### Prompt Rendering

```typescript
import { 
  renderComponent, 
  renderComponents,
  RenderOptions 
} from 'promptfmt';
import { RoleComponent } from 'promptfmt';

// Render a single component
const component = new RoleComponent('You are a helper');
const rendered = renderComponent(component, {});
// Returns: "Role\nYou are a helper"

// Render multiple components
const components = [
  new RoleComponent('You are a helper'),
  new GoalComponent('Help users')
];
const prompt = renderComponents(components, {}, {
  separator: '\n\n', // Default: '\n\n'
  includeLabels: true, // Default: true
  skipEmpty: true // Default: true
});

// Custom render options
const options: RenderOptions = {
  separator: '\n---\n',
  includeLabels: false,
  labelFormatter: (component) => `[${component.type.toUpperCase()}]`,
  skipEmpty: false
};
```

**Default Component Labels**: When using `renderComponent` or `renderComponents`, default labels are automatically applied if no custom label is provided:
- `role` → "Role"
- `goal` → "Goal"
- `input` → "Input"
- `output` → "Output"
- `context` → "Context"
- `persona` → "Persona"
- `tone` → "Tone"
- `few-shots` → "Examples"
- `guardrails` → "Guardrails"
- `constraints` → "Constraints"
- `tasks` → "Tasks"
- `steps` → "Steps"

Note: `PromptBuilder.build()` does not use these default labels - it only includes labels if explicitly set via the `label` option.

### Types

All TypeScript types are exported for use in your code:

```typescript
import type { 
  PromptComponent,
  ComponentType,
  ComponentOptions,
  ParameterMap,
  ContentValue,
  TemplateString,
  Condition,
  ConditionFunction,
  RenderOptions
} from 'promptfmt';
```

- `PromptComponent` - Base interface for all components
- `ComponentType` - Enum of all component types (`ROLE`, `GOAL`, `INPUT`, etc.)
- `ComponentOptions` - Options for adding components (condition, order, label)
- `ParameterMap` - Type for parameter objects (`Record<string, any>`)
- `ContentValue` - Content type: `string | TemplateString | ((params: ParameterMap) => string)`
- `TemplateString` - Type alias for template strings
- `Condition` - Conditional logic structure with `if`, `then`, and optional `else`
- `ConditionFunction` - Function type: `(params: ParameterMap) => boolean`
- `RenderOptions` - Options for rendering components (separator, includeLabels, labelFormatter, skipEmpty)

## Examples

See the [`examples/`](examples/) directory for comprehensive examples demonstrating:
- Basic usage
- Parameter substitution
- Conditional logic
- Component ordering
- Custom labels
- Dynamic content with functions
- All component types
- Complex real-world scenarios

Run examples with:
```bash
npm run build
npx ts-node -r tsconfig-paths/register examples/run-all.ts
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

