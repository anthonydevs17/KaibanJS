import { Cue } from '../../../../src/cue';
import { z } from 'zod';
import { log } from './logger';

// Basic math operations
export const createMathBlocks = () => {
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

  return { addBlock, multiplyBlock };
};

// Parallel operations
export const createParallelBlocks = () => {
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

  return { squareBlock, cubeBlock };
};

// Branch operations
export const createBranchBlocks = () => {
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

  return { greaterThanBlock, lessThanBlock };
};

// Loop operations
export const createLoopBlocks = () => {
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

  return { counterBlock, processItemBlock };
};
