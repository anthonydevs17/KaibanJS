import { Cue } from '../../../src/cue';
import { z } from 'zod';
import { log, monitorCue } from './utils/logger';

// Create parallel workflow
const createParallelWorkflow = () => {
  // Define blocks
  const squareBlock = Cue.createBlock({
    id: 'square',
    inputSchema: z.number(),
    outputSchema: z.number(),
    execute: async ({ inputData }) => {
      const result = inputData * inputData;
      log('Square block executed', { input: inputData, result });
      return result;
    },
  });

  const cubeBlock = Cue.createBlock({
    id: 'cube',
    inputSchema: z.number(),
    outputSchema: z.number(),
    execute: async ({ inputData }) => {
      const result = inputData * inputData * inputData;
      log('Cube block executed', { input: inputData, result });
      return result;
    },
  });

  const cue = Cue.createCue({
    id: 'parallel-workflow',
    inputSchema: z.number(),
    outputSchema: z.object({
      square: z.number(),
      cube: z.number(),
    }),
  });

  // Execute blocks in parallel
  cue.parallel([squareBlock, cubeBlock]);

  return cue;
};

// Example usage
const main = async () => {
  try {
    const workflow = createParallelWorkflow();
    const unsubscribeMain = monitorCue(workflow);

    const result = await workflow.start(5);

    log('Final result:', result);
    unsubscribeMain();
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
