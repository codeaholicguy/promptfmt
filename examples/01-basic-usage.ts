/**
 * Example 1: Basic Usage
 * 
 * This example demonstrates the simplest way to use promptfmt
 * to build a prompt with basic components, including array-based components.
 */

import { PromptBuilder } from '../dist';

const prompt = new PromptBuilder()
  .role('You are a helpful assistant')
  .goal('Answer user questions clearly and concisely')
  .input('User question: ${question}')
  .steps([
    'Understand the question',
    'Provide a clear answer',
    'Include relevant examples if needed'
  ])
  .constraints([
    'Keep response concise (2-3 sentences)',
    'Use simple language',
    'Be accurate and helpful'
  ])
  .output('Provide a clear answer in 2-3 sentences')
  .build({
    question: 'What is TypeScript?'
  });

console.log('=== Basic Usage Example ===');
console.log(prompt);
console.log('\n');

