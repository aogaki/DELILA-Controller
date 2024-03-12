import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ServerSettings, ExperimentSettings } from "./server-settings";
import { Observable, throwError, catchError, retry } from "rxjs";
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

  nRetry = 3;

  getStatus(): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.getStatus;
    return this.http
      .get<DelilaResponse>(url)
      .pipe(catchError(this.handleError));
  }

  postConfig(): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.configure;
    return this.http
      .post<DelilaResponse>(url, "")
      .pipe(retry(this.nRetry), catchError(this.handleError));
  }

  postUnconfig(): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.unconfigure;
    return this.http
      .post<DelilaResponse>(url, "")
      .pipe(retry(this.nRetry), catchError(this.handleError));
  }

  postStart(runNo: number): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.start + "/" + runNo;
    return this.http
      .post<DelilaResponse>(url, "")
      .pipe(retry(this.nRetry), catchError(this.handleError));
  }

  postStop(): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.stop;
    return this.http
      .post<DelilaResponse>(url, "")
      .pipe(retry(this.nRetry), catchError(this.handleError));
  }

  postConfigAndStart(runNo: number): Observable<DelilaResponse> {
    const url =
      this.baseUrl + "/" + this.serverSettings.configureAndStart + "/" + runNo;
    return this.http
      .post<DelilaResponse>(url, "")
      .pipe(retry(this.nRetry), catchError(this.handleError));
  }

  postStopAndUnconfig(): Observable<DelilaResponse> {
    // Implementing error handler
    const url = this.baseUrl + "/" + this.serverSettings.stopAndUnconfigure;
    return this.http
      .post<DelilaResponse>(url, "")
      .pipe(retry(this.nRetry), catchError(this.handleError));
  }

  postDryRun(): Observable<DelilaResponse> {
    const url = this.baseUrl + "/" + this.serverSettings.dryRun;
    return this.http
      .post<DelilaResponse>(url, "")
      .pipe(catchError(this.handleError));
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

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error("Something bad happened; please try again later.")
    );
  }
}
