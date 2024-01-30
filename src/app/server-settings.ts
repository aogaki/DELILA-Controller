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
}
