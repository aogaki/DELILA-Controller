export interface DelilaResponse {
  response: DelilaStatus;
}

export interface compStatus {
  compName: string;
  state: string;
  eventNum: string;
  compStatus: string;
}

export interface daqResult {
  status: string;
  code: string;
  className: string;
  name: string;
  methodName: string;
  messageEng: string;
  messageJpn: string;
}

export interface daqLog {
  log: compStatus[];
}

export interface daqReturnValues {
  result: daqResult;
  logs: daqLog;
}

export interface DelilaStatus {
  methodName: string;
  returnValue: daqReturnValues;
}
