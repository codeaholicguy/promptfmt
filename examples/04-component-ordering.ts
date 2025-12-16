/**
 * Example 4: Component Ordering & Steps Array
 * 
 * This example shows how to control the order of components
 * using the order option, and demonstrates the steps array feature.
 */

import { PromptBuilder } from '../dist';

// Without explicit ordering (uses insertion order)
const prompt1 = new PromptBuilder()
  .output('Output format')
  .role('You are a helper')
  .goal('Help users')
  .input('User input')
  .build();

console.log('=== Without Explicit Ordering ===');
console.log(prompt1);
console.log('\n');

// With explicit ordering
const prompt2 = new PromptBuilder()
  .output('Output format', { order: 3 })
  .role('You are a helper', { order: 1 })
  .goal('Help users', { order: 2 })
  .input('User input', { order: 4 })
  .build();

console.log('=== With Explicit Ordering ===');
console.log(prompt2);
console.log('\n');

// Steps with array - auto-prefixed
const prompt3 = new PromptBuilder()
  .role('You are a task assistant')
  .goal('Help users complete tasks')
  .steps([
    'Understand the task requirements',
    'Break down into smaller steps',
    'Execute each step',
    'Verify completion'
  ])
  .build();

console.log('=== Steps with Array (Auto-prefixed) ===');
console.log(prompt3);
console.log('\n');

// Steps with function returning array
const prompt4 = new PromptBuilder()
  .role('You are a code reviewer')
  .steps((params) => {
    if (params.complexity === 'high') {
      return [
        'Review architecture',
        'Check performance',
        'Verify security',
        'Test edge cases'
      ];
    }
    return [
      'Quick code scan',
      'Check best practices',
      'Provide feedback'
    ];
  })
  .tasks([
    'Analyze code structure',
    'Check for bugs',
    'Review best practices'
  ])
  .constraints([
    'Focus on code quality',
    'Provide constructive feedback'
  ])
  .build({
    complexity: 'high'
  });

console.log('=== Steps with Function Returning Array ===');
console.log(prompt4);
console.log('\n');

// Demonstrating all array-based components
const prompt5 = new PromptBuilder()
  .role('You are a writing assistant')
  .tasks([
    'Review the draft',
    'Suggest improvements',
    'Check grammar and style'
  ])
  .steps([
    'Read through the content',
    'Identify areas for improvement',
    'Provide specific suggestions',
    'Review final version'
  ])
  .fewShots([
    'Input: "The cat sat on the mat."\nOutput: "The cat sat gracefully on the woven mat."',
    'Input: "I went to the store."\nOutput: "I walked to the local grocery store."'
  ])
  .guardrails([
    'Maintain the author\'s voice',
    'Preserve the original meaning',
    'Be respectful and constructive'
  ])
  .constraints([
    'Keep suggestions concise',
    'Focus on clarity and flow',
    'Maintain original intent'
  ])
  .build();

console.log('=== All Array-Based Components ===');
console.log(prompt5);
console.log('\n');
