import { Cue } from '../../../../src/cue';
import { z } from 'zod';
import { log, monitorCue } from '../utils/logger';

// Create foreach workflow
const createForEachWorkflow = () => {
  // Define block
  const processItemBlock = Cue.createBlock({
    id: 'process-item',
    inputSchema: z.number(),
    outputSchema: z.number(),
    execute: async ({ inputData }) => {
      const result = inputData * 3;
      log('Process item block executed', { input: inputData, result });
      return result;
    },
  });

  const cue = Cue.createCue({
    id: 'foreach-workflow',
    inputSchema: z.array(z.number()),
    outputSchema: z.array(z.number()),
  });

  // Process each item in the array
  cue.foreach(processItemBlock);

  return cue;
};

// Example usage
const main = async () => {
  try {
    const workflow = createForEachWorkflow();
    const unsubscribeMain = monitorCue(workflow);

    const result = await workflow.start([1, 2, 3, 4, 5]);

    log('Final result:', result);
    unsubscribeMain();
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
