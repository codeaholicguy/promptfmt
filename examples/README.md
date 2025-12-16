# Promptfmt Examples

This directory contains example files demonstrating various use cases of the `promptfmt` library.

## Running Examples

First, build the package:

```bash
npm run build
```

Then run examples using one of these methods:

### Method 1: Using ts-node (Recommended)
```bash
# Install ts-node if not already installed
npm install -g ts-node

# Run an example
npx ts-node -r tsconfig-paths/register examples/01-basic-usage.ts

# Or run all examples
npx ts-node -r tsconfig-paths/register examples/run-all.ts
```

### Method 2: Using Node with compiled output
```bash
# Build the package first
npm run build

# Examples import from src, so they need to be run with ts-node
# or you can modify imports to use '../dist' after building
```

### Method 3: Import in your own code
After installing the package, you can import and use it:

```typescript
import { PromptBuilder } from 'promptfmt';

const prompt = new PromptBuilder()
  .role('You are a helper')
  .goal('Help users')
  .build();
```

## Example Files

### 01-basic-usage.ts
Demonstrates the simplest way to use promptfmt with basic components (role, goal, input, output).

### 02-parameter-substitution.ts
Shows how to use template strings with `${paramName}` syntax and function-based dynamic content.

### 03-conditional-logic.ts
Demonstrates conditional logic to include/exclude components based on runtime parameters.

### 04-component-ordering.ts
Shows how to control the order of components using the `order` option.

### 05-complex-example.ts
A sophisticated code review assistant that adapts based on programming language, code complexity, reviewer expertise level, and focus areas. Shows advanced conditional logic, dynamic content, and real-world complexity.

### 06-all-components.ts
Demonstrates all available component types in a single prompt (role, goal, context, input, persona, tone, tasks, steps, few-shots, guardrails, constraints, output).

### 07-custom-labels.ts
Shows how to use custom labels for components to create more structured and readable prompts.

### 08-dynamic-content.ts
Demonstrates using functions for dynamic content generation based on parameters.

## Key Concepts

### Parameter Substitution
Use `${paramName}` in template strings:
```typescript
.role('Hello ${name}')
```

### Function-based Content
Use functions for dynamic content:
```typescript
.role((params) => `Hello ${params.name}`)
```

### Conditional Logic
Include components conditionally:
```typescript
.persona('Persona A', {
  condition: createCondition(
    (params) => params.age > 18,
    new PersonaComponent('Adult Persona'),
    new PersonaComponent('Child Persona')
  )
})
```

### Component Ordering
Control component order:
```typescript
.role('Role', { order: 1 })
.goal('Goal', { order: 2 })
```

### Custom Labels
Add custom labels:
```typescript
.role('Role', { label: '🎭 ROLE' })
```

