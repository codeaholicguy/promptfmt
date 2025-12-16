/**
 * Example 2: Parameter Substitution
 * 
 * This example shows how to use template strings with parameter substitution
 * and function-based dynamic content.
 */

import { PromptBuilder } from '../dist';

const prompt = new PromptBuilder()
  .role('You are a personal assistant for ${userName}')
  .goal('Help ${userName} with their daily tasks')
  .context((params) => {
    return `Today is ${params.date}. ${params.userName} is ${params.age} years old and works as a ${params.job}.`;
  })
  .input({
    task: '${task}',
    priority: '${priority}',
    deadline: '${deadline}'
  })
  .tasks([
    'Break down the task into smaller steps',
    'Identify required resources',
    'Create a timeline',
    'Set up reminders'
  ])
  .steps([
    'Analyze the task requirements',
    'Plan the approach',
    'Execute the plan',
    'Review and adjust'
  ])
  .output('Provide a step-by-step plan for ${userName}')
  .build({
    userName: 'Alice',
    date: 'March 15, 2024',
    age: 28,
    job: 'Software Engineer',
    task: 'Complete project documentation',
    priority: 'High',
    deadline: 'End of week'
  });

console.log('=== Parameter Substitution Example ===');
console.log(prompt);
console.log('\n');

