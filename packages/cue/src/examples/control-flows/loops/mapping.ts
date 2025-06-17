import { Cue } from '../../../../src/cue';
import { z } from 'zod';
import { log, monitorCue } from '../utils/logger';

// Create mapping workflow
const createMappingWorkflow = () => {
  // Define blocks
  const multiplyBlock = Cue.createBlock({
    id: 'multiply',
    inputSchema: z.number(),
    outputSchema: z.object({
      original: z.number(),
      multiplied: z.number(),
    }),
    execute: async ({ inputData }) => {
      const result = {
        original: inputData,
        multiplied: inputData * 2,
      };
      log('Multiply block executed', { input: inputData, result });
      return result;
    },
  });

  const addBlock = Cue.createBlock({
    id: 'add',
    inputSchema: z.object({
      value: z.number(),
      increment: z.number(),
    }),
    outputSchema: z.number(),
    execute: async ({ inputData }) => {
      const result = inputData.value + inputData.increment;
      log('Add block executed', { input: inputData, result });
      return result;
    },
  });

  const cue = Cue.createCue({
    id: 'mapping-workflow',
    inputSchema: z.number(),
    outputSchema: z.number(),
  });

  // Chain blocks with mapping
  cue
    .then(multiplyBlock)
    .map({
      value: {
        block: multiplyBlock,
        path: 'multiplied',
      },
      increment: {
        value: 5,
        schema: z.number(),
      },
    })
    .then(addBlock);

  return cue;
};

// Example usage
const main = async () => {
  try {
    const workflow = createMappingWorkflow();
    const unsubscribeMain = monitorCue(workflow);

    const result = await workflow.start(3); // Input: 3
    // Expected flow:
    // 1. multiplyBlock: 3 -> { original: 3, multiplied: 6 }
    // 2. map: { value: 6, increment: 5 }
    // 3. addBlock: 6 + 5 -> 11

    log('Final result:', result);
    unsubscribeMain();
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
