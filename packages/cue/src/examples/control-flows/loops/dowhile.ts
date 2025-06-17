import { Cue } from '../../../../src/cue';
import { z } from 'zod';
import { log, monitorCue } from '../utils/logger';

// Create do-while workflow
const createDoWhileWorkflow = () => {
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
    id: 'dowhile-workflow',
    inputSchema: z.number(),
    outputSchema: z.number(),
  });

  // Execute block while condition is true
  cue.dowhile(
    counterBlock,
    async ({ inputData }) => inputData < 5 // Continue while number is less than 5
  );

  return cue;
};

// Example usage
const main = async () => {
  try {
    const workflow = createDoWhileWorkflow();
    const unsubscribeMain = monitorCue(workflow);

    const result = await workflow.start(1); // Start from 1

    log('Final result:', result);
    unsubscribeMain();
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
