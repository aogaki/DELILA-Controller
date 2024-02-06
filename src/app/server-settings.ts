export interface ServerSettings {
  apiAddress: string;
  rootDir: string;
  getStatus: string;
  configure: string;
  unconfigure: string;
  start: string;
  stop: string;
  configureAndStart: string;
  stopAndUnconfigure: string;
  dryRun: string;
  dbDir: string;
  createRecord: string;
  getRecords: string;
  updateRecord: string;
  monitorAddress: string;
}

export interface ExperimentSettings {
  expName: string;
  computerName: string;
}
