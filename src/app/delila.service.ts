import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerSettings } from './server-settings';
import { Observable } from 'rxjs';
import { DelilaResponse } from './delila-response';

@Injectable({
  providedIn: 'root',
})
export class DelilaService {
  serverSettings!: ServerSettings;
  baseUrl!: string;
  private readonly http = inject(HttpClient);

  getStatus(): Observable<DelilaResponse> {
    const url = this.baseUrl + '/' + this.serverSettings.getStatus;
    return this.http.get<DelilaResponse>(url);
  }

  postConfig(): Observable<DelilaResponse> {
    const url = this.baseUrl + '/' + this.serverSettings.configure;
    return this.http.post<DelilaResponse>(url, '');
  }

  postUnconfig(): Observable<DelilaResponse> {
    const url = this.baseUrl + '/' + this.serverSettings.unconfigure;
    return this.http.post<DelilaResponse>(url, '');
  }

  postStart(runNo: number): Observable<DelilaResponse> {
    const url = this.baseUrl + '/' + this.serverSettings.start + '/' + runNo;
    return this.http.post<DelilaResponse>(url, '');
  }

  postStop(): Observable<DelilaResponse> {
    const url = this.baseUrl + '/' + this.serverSettings.stop;
    return this.http.post<DelilaResponse>(url, '');
  }

  postConfigAndStart(runNo: number): Observable<DelilaResponse> {
    const url =
      this.baseUrl + '/' + this.serverSettings.configureAndStart + '/' + runNo;
    return this.http.post<DelilaResponse>(url, '');
  }

  postStopAndUnconfig(): Observable<DelilaResponse> {
    const url = this.baseUrl + '/' + this.serverSettings.stopAndUnconfigure;
    return this.http.post<DelilaResponse>(url, '');
  }

  postDryRun(): Observable<DelilaResponse> {
    const url = this.baseUrl + '/' + this.serverSettings.dryRun;
    return this.http.post<DelilaResponse>(url, '');
  }

  loadServerSettings() {
    this.http
      .get<ServerSettings>('/assets/server-settings.json')
      .subscribe((serverSettings) => {
        this.serverSettings = serverSettings as ServerSettings;
        this.baseUrl =
          'http://' +
          this.serverSettings.apiAddress +
          '/' +
          this.serverSettings.rootDir;
        console.log('Server settings loaded', this.serverSettings);
      });
  }

  constructor() {
    this.loadServerSettings();
  }
}
