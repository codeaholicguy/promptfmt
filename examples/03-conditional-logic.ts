/**
 * Example 3: Conditional Logic
 * 
 * This example demonstrates how to use conditional logic to include/exclude
 * components based on runtime parameters.
 */

import { PromptBuilder, createCondition, PersonaComponent, ToneComponent } from '../dist';

const prompt = new PromptBuilder()
  .role('You are a mental health support assistant')
  .goal('Provide emotional support and guidance')
  .persona('The Steady Anchor', {
    condition: createCondition(
      (params) => params.emotion === 'sad' || params.emotion === 'anxious',
      new PersonaComponent('The Steady Anchor - provides calm, grounding support')
    )
  })
  .persona('The Warm Horizon', {
    condition: createCondition(
      (params) => params.emotion === 'hopeful' || params.emotion === 'motivated',
      new PersonaComponent('The Warm Horizon - provides encouraging, uplifting support')
    )
  })
  .tone('Calm and supportive', {
    condition: createCondition(
      (params) => params.age < 18,
      new ToneComponent('Use simple, age-appropriate language')
    )
  })
  .tone('Professional and empathetic', {
    condition: createCondition(
      (params) => params.age >= 18,
      new ToneComponent('Use professional but warm language')
    )
  })
  .input('User feeling: ${emotion}\nUser age: ${age}')
  .guardrails([
    'Always prioritize user safety',
    'Do not provide medical diagnosis',
    'Encourage professional help when needed',
    'Be empathetic and non-judgmental'
  ])
  .constraints((params) => {
    const constraints = [
      `Provide ${params.responseLength} sentences of support`,
      'Use age-appropriate language'
    ];
    if (params.age < 18) {
      constraints.push('Use simpler vocabulary');
      constraints.push('Include reassurance');
    }
    return constraints;
  })
  .output('Provide ${responseLength} sentences of support')
  .build({
    emotion: 'sad',
    age: 25,
    responseLength: 3
  });

console.log('=== Conditional Logic Example ===');
console.log(prompt);
console.log('\n');

// Example with different parameters
const prompt2 = new PromptBuilder()
  .role('You are a mental health support assistant')
  .goal('Provide emotional support and guidance')
  .persona('The Warm Horizon', {
    condition: createCondition(
      (params) => params.emotion === 'hopeful',
      new PersonaComponent('The Warm Horizon - provides encouraging support')
    )
  })
  .build({
    emotion: 'hopeful',
    age: 30
  });

console.log('=== Conditional Logic Example (Different Parameters) ===');
console.log(prompt2);
console.log('\n');

