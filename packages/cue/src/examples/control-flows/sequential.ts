import { Cue } from '../../../src/cue';
import { z } from 'zod';
import { log, monitorCue } from './utils/logger';

// Create sequential workflow
const createSequentialWorkflow = () => {
  // Define blocks
  const addBlock = Cue.createBlock({
    id: 'add',
    inputSchema: z.object({ a: z.number(), b: z.number() }),
    outputSchema: z.number(),
    execute: async ({ inputData }) => {
      const result = inputData.a + inputData.b;
      log('Add block executed', { input: inputData, result });
      return result;
    },
  });

  const multiplyBlock = Cue.createBlock({
    id: 'multiply',
    inputSchema: z.number(),
    outputSchema: z.number(),
    execute: async ({ inputData }) => {
      const result = inputData * 2;
      log('Multiply block executed', { input: inputData, result });
      return result;
    },
  });

  const cue = Cue.createCue({
    id: 'sequential-workflow',
    inputSchema: z.object({ a: z.number(), b: z.number() }),
    outputSchema: z.number(),
  });

  // Chain blocks sequentially
  cue.then(addBlock).then(multiplyBlock);

  return cue;
};

// Example usage
const main = async () => {
  try {
    const workflow = createSequentialWorkflow();
    const unsubscribeMain = monitorCue(workflow);

    const result = await workflow.start({
      a: 5,
      b: 3,
    });

    log('Final result:', result);
    unsubscribeMain();
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
