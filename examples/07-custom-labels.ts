/**
 * Example 7: Custom Labels
 * 
 * This example shows how to use custom labels for components
 * to create more structured and readable prompts.
 */

import { PromptBuilder } from '../dist';

const prompt = new PromptBuilder()
  .role('You are a code review assistant', {
    label: '🎭 ROLE'
  })
  .goal('Review code and provide constructive feedback', {
    label: '🎯 GOAL'
  })
  .context('Codebase: ${codebase}\nLanguage: ${language}\nFramework: ${framework}', {
    label: '📋 CONTEXT'
  })
  .input('Code to review:\n${code}', {
    label: '📥 INPUT'
  })
  .tasks([
    'Check for bugs',
    'Review code style',
    'Suggest improvements',
    'Verify best practices'
  ], {
    label: '✅ TASKS'
  })
  .constraints([
    'Focus on code quality',
    'Follow best practices',
    'Consider performance',
    'Ensure security'
  ], {
    label: '⚠️ CONSTRAINTS'
  })
  .guardrails([
    'Be constructive and respectful',
    'Focus on the code, not the person',
    'Provide actionable feedback'
  ], {
    label: '🛡️ GUARDRAILS'
  })
  .output('Provide:\n- Summary of findings\n- Specific recommendations\n- Code examples if needed', {
    label: '📤 OUTPUT'
  })
  .build({
    codebase: 'TypeScript',
    language: 'TypeScript',
    framework: 'React',
    code: 'function add(a: number, b: number) { return a + b; }'
  });

console.log('=== Custom Labels Example ===');
console.log(prompt);
console.log('\n');

