import { Cue } from '../../../src/cue';
import { z } from 'zod';
import { log, monitorCue } from './utils/logger';

// Create branch workflow
const createBranchWorkflow = () => {
  // Define blocks
  const greaterThanBlock = Cue.createBlock({
    id: 'greater-than',
    inputSchema: z.number(),
    outputSchema: z.string(),
    execute: async ({ inputData }) => {
      const result = `Number ${inputData} is greater than 10`;
      log('Greater than block executed', { input: inputData, result });
      return result;
    },
  });

  const lessThanBlock = Cue.createBlock({
    id: 'less-than',
    inputSchema: z.number(),
    outputSchema: z.string(),
    execute: async ({ inputData }) => {
      const result = `Number ${inputData} is less than or equal to 10`;
      log('Less than block executed', { input: inputData, result });
      return result;
    },
  });

  const cue = Cue.createCue({
    id: 'branch-workflow',
    inputSchema: z.number(),
    outputSchema: z.string(),
  });

  // Create conditional branches
  cue.branch([
    [async ({ inputData }) => inputData > 10, greaterThanBlock],
    [async ({ inputData }) => inputData <= 10, lessThanBlock],
  ]);

  return cue;
};

// Example usage
const main = async () => {
  try {
    const workflow = createBranchWorkflow();
    const unsubscribeMain = monitorCue(workflow);

    // Test with different numbers
    const results = await Promise.all([
      workflow.start(5), // Should use lessThanBlock
      workflow.start(15), // Should use greaterThanBlock
    ]);

    log('Final results:', results);
    unsubscribeMain();
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
