import { Cue } from '../../../src/cue';
import { z } from 'zod';
import { log, monitorCue } from './utils/logger';
import { createParallelBlocks } from './utils/blocks';

// Create parallel workflow
const createParallelWorkflow = () => {
  const { squareBlock, cubeBlock } = createParallelBlocks();

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
