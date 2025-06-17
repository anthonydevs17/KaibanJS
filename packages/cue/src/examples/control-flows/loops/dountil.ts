import { Cue } from '../../../../src/cue';
import { z } from 'zod';
import { log, monitorCue } from '../utils/logger';
import { createLoopBlocks } from '../utils/blocks';

// Create do-until workflow
const createDoUntilWorkflow = () => {
  const { counterBlock } = createLoopBlocks();

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
