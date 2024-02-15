import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ServerSettings, ExperimentSettings } from "./server-settings";
import { Observable } from "rxjs";
import { DelilaResponse } from "./delila-response";
import { RunLog } from "./run-log";
import { MonitorLinks } from "./monitor-links";

@Injectable({
  providedIn: "root",
})
export class DelilaService {
  serverSettings!: ServerSettings;
  baseUrl!: string;
  baseDBUrl!: string;
  private readonly http = inject(HttpClient);

  getStatus(): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.getStatus;
    return this.http.get<DelilaResponse>(url);
  }

  postConfig(): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.configure;
    return this.http.post<DelilaResponse>(url, "");
  }

  postUnconfig(): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.unconfigure;
    return this.http.post<DelilaResponse>(url, "");
  }

  postStart(runNo: number): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.start + "/" + runNo;
    return this.http.post<DelilaResponse>(url, "");
  }

  postStop(): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.stop;
    return this.http.post<DelilaResponse>(url, "");
  }

  postConfigAndStart(runNo: number): Observable<DelilaResponse> {
    const url =
      this.baseUrl + "/" + this.serverSettings.configureAndStart + "/" + runNo;
    return this.http.post<DelilaResponse>(url, "");
  }

  postStopAndUnconfig(): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.stopAndUnconfigure;
    return this.http.post<DelilaResponse>(url, "");
  }

  postDryRun(): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.dryRun;
    return this.http.post<DelilaResponse>(url, "");
  }

  createRecord(runLog: RunLog): Observable<RunLog> {
    const url = this.baseDBUrl + "/" + this.serverSettings.createRecord;
    return this.http.post<RunLog>(url, runLog);
  }

  updateRecord(runLog: RunLog): Observable<RunLog> {
    const url = this.baseDBUrl + "/" + this.serverSettings.updateRecord;
    return this.http.post<RunLog>(url, runLog);
  }

  getRunLog(expName: string, size: number): Observable<RunLog[]> {
    const url =
      this.baseDBUrl +
      "/" +
      this.serverSettings.getRecords +
      "/" +
      expName +
      "?listSize=" +
      size;
    return this.http.get<RunLog[]>(url);
  }

  getHistogram(name: string): Observable<any> {
    const url =
      "http://" +
      this.serverSettings.monitorAddress +
      "/" +
      name +
      "/root.json.gz";
    return this.http.get<any>(url);
  }

  loadExperimentSettings(): Observable<ExperimentSettings> {
    return this.http.get<ExperimentSettings>(
      "/assets/experiment-settings.json"
    );
  }

  loadServerSettings() {
    this.http
      .get<ServerSettings>("/assets/server-settings.json")
      .subscribe((serverSettings) => {
        this.serverSettings = serverSettings as ServerSettings;
        this.baseUrl =
          "http://" +
          this.serverSettings.apiAddress +
          "/" +
          this.serverSettings.rootDir;
        this.baseDBUrl =
          "http://" +
          this.serverSettings.apiAddress +
          "/" +
          this.serverSettings.dbDir;
        console.log("Server settings loaded", this.serverSettings);
      });
  }

  getMonitorLinks(): Observable<MonitorLinks[]> {
    return this.http.get<MonitorLinks[]>("/assets/monitor-links.json");
  }
}
