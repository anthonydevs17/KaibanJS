import { Cue } from '../../../../src/cue';
import { z } from 'zod';
import { log, monitorCue } from '../utils/logger';

// Create do-until workflow
const createDoUntilWorkflow = () => {
  // Define block
  const counterBlock = Cue.createBlock({
    id: 'counter',
    inputSchema: z.number(),
    outputSchema: z.number(),
    execute: async ({ inputData }) => {
      const result = inputData + 1;
      log('Counter block executed', { input: inputData, result });
      return result;
    },
  });

  const cue = Cue.createCue({
    id: 'dountil-workflow',
    inputSchema: z.number(),
    outputSchema: z.number(),
  });

  // Execute block until condition becomes true
  cue.dountil(
    counterBlock,
    async ({ inputData }) => inputData >= 5 // Stop when number reaches or exceeds 5
  );

  return cue;
};

// Example usage
const main = async () => {
  try {
    const workflow = createDoUntilWorkflow();
    const unsubscribeMain = monitorCue(workflow);

    const result = await workflow.start(1); // Start from 1

    log('Final result:', result);
    unsubscribeMain();
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
