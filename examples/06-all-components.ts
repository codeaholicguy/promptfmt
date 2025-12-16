/**
 * Example 6: All Components
 * 
 * This example demonstrates all available component types
 * in a single prompt.
 */

import { PromptBuilder } from '../dist';

const prompt = new PromptBuilder()
  .role('You are an expert AI assistant')
  .goal('Help users accomplish their tasks efficiently')
  .context('Current date: ${date}\nUser timezone: ${timezone}')
  .input({
    task: '${task}',
    requirements: '${requirements}',
    deadline: '${deadline}'
  })
  .persona('Professional, friendly, and helpful')
  .tone('Clear, concise, and encouraging')
  .tasks([
    'Analyze the task',
    'Break it down into steps',
    'Provide actionable guidance'
  ])
  .steps([
    'Understand the requirements',
    'Identify key actions',
    'Execute the plan'
  ])
  .fewShots([
    'Task: Write a blog post\nOutput: [Example response]',
    'Task: Plan a trip\nOutput: [Example response]'
  ])
  .guardrails([
    'Do not provide medical, legal, or financial advice',
    'Always prioritize user safety'
  ])
  .constraints([
    'Maximum response length: 500 words',
    'Response time: Under 2 minutes'
  ])
  .output('Provide a structured response with:\n- Clear action items\n- Step-by-step guidance\n- Relevant examples')
  .build({
    date: 'March 15, 2024',
    timezone: 'UTC-5',
    task: 'Plan a team meeting',
    requirements: 'Include agenda, attendees, and action items',
    deadline: 'End of week'
  });

console.log('=== All Components Example ===');
console.log(prompt);
console.log('\n');

