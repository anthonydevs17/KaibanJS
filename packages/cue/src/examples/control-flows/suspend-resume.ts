import { Cue } from '../../cue';
import { z } from 'zod';
import { log, monitorCue } from './utils/logger';

// Create a simple suspend/resume workflow
const createSimpleWorkflow = () => {
  // Simple block that can be suspended
  const suspendBlock = Cue.createBlock({
    id: 'suspend',
    inputSchema: z.object({
      value: z.number(),
    }),
    outputSchema: z.number(),
    execute: async ({ inputData, suspend }) => {
      log('Block suspending', { input: inputData });
      await suspend(inputData);
      return inputData.value * 2;
    },
  });

  // Create the workflow
  const cue = Cue.createCue({
    id: 'simple-workflow',
    inputSchema: z.object({
      value: z.number(),
    }),
    outputSchema: z.number(),
  });

  // Add the block to the workflow
  cue.then(suspendBlock);

  return cue;
};

// Example usage
const main = async () => {
  try {
    console.log('Starting workflow...');
    const workflow = createSimpleWorkflow();
    const unsubscribe = monitorCue(workflow);

    // Start workflow
    const result = await workflow.start({
      value: 10,
    });

    console.log('Workflow started with result:', result);

    if (result.status === 'suspended' && result.steps.suspend) {
      const suspendedStep = result.steps.suspend;
      log('Workflow suspended', result);
      console.log('--------------------------------');
      console.log('Suspended step info:', {
        status: suspendedStep.status,
        output: suspendedStep.output,
        suspendedPath: suspendedStep.suspendedPath,
      });
      console.log('--------------------------------');

      // Resume after delay
      setTimeout(async () => {
        try {
          console.log('--------------------------------Resuming workflow...');
          const resumeResult = await workflow.resume({
            block: 'suspend',
            resumeData: suspendedStep.output,
          });
          log('Workflow completed', resumeResult);
        } catch (error: any) {
          console.error('Resume error:', error);
          if (error && typeof error === 'object') {
            console.error('Error details:', {
              name: error.name,
              message: error.message,
              stack: error.stack,
            });
          }
        }
      }, 6000);
    }

    // Keep the process alive
    setTimeout(() => {
      console.log('Cleaning up...');
      unsubscribe();
    }, 7000);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Execute main function
main().catch(console.error);
