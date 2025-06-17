export const log = (message: string, data?: any) => {
  console.log(`\n[${new Date().toISOString()}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

export const monitorCue = (cue: any) => {
  // Monitor overall Cue status
  cue.watch((event: any) => {
    log(`Cue Status Update: ${event.type}`, event.data);
  });

  // Monitor block results
  const unsubscribe = cue.store.subscribe((state: any) => {
    const lastLog = state.logs[state.logs.length - 1];
    if (lastLog?.logType === 'BlockStatusUpdate') {
      log(`Block ${lastLog.blockId} Status: ${lastLog.blockStatus}`, {
        result: lastLog.blockResult,
        executionPath: state.executionPath,
      });
    }
  });

  return unsubscribe;
};
