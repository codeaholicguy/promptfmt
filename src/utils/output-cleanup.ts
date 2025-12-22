/**
 * Cleans up text output by removing redundant whitespace and newlines
 * - Removes trailing whitespace from each line
 * - Collapses multiple consecutive newlines (3+) to 2 newlines
 * - Removes multiple consecutive spaces/tabs within lines (preserves single spaces)
 * - Trims the entire output
 * 
 * @param text - The text to clean up
 * @returns Cleaned text with redundant whitespace removed
 */
export function cleanupOutput(text: string): string {
  // Handle null, undefined, or empty string
  if (!text || text.length === 0) {
    return '';
  }

  return text
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\t/g, ' ') // Normalize tabs to spaces first
    .replace(/[ ]{2,}/g, ' ') // Then collapse multiple spaces
    .trim();
}

