import { Component, inject, Output, EventEmitter, OnInit } from "@angular/core";
import { DelilaStatus, compStatus } from "../../delila-response";
import { DelilaService } from "../../delila.service";
import { RunLog } from "../../run-log";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";

interface DelilaButton {
  configure: boolean;
  unconfigure: boolean;
  start: boolean;
  stop: boolean;
  pause: boolean;
  resume: boolean;
}

@Component({
  selector: "app-controller-button",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  templateUrl: "./controller-button.component.html",
  styleUrl: "./controller-button.component.css",
})
export class ControllerButtonComponent implements OnInit {
  nextRunNo: number = 1;
  runNo = -1;
  computerName: string = "localhost";
  autoIncFlag: boolean = true;
  connFlag: boolean = false;
  checkStatusFlag: boolean = true;
  spinnerFlag: boolean = false;
  logs: compStatus[] = [];

  delilaStatus$!: DelilaStatus;
  @Output() statusChange = new EventEmitter<DelilaStatus>();

  currentRun: RunLog = {
    runNumber: 1234,
    start: 0,
    stop: 0,
    expName: "",
    comment: "",
    source: "",
    distance: "",
  };
  runRecord$?: RunLog[];
  @Output() runRecordChange = new EventEmitter<RunLog[]>();

  // constructor() {}
  constructor(private delila: DelilaService) {}
  recordLength = 10;
  updateInterval = 1000;

  // private readonly delila = inject(DelilaService);
  ngOnInit() {
    this.delila.loadServerSettings();
    this.delila.loadExperimentSettings().subscribe((response) => {
      console.log("Experiment settings loaded", response);
      this.currentRun.expName = response.expName;
      this.computerName = response.computerName;

      this.onGetStatus();
      this.getRunLog(this.recordLength);
    });

    setInterval(() => {
      this.onGetStatus();
    }, this.updateInterval);
  }

  daqButtonState: DelilaButton = {
    configure: false,
    unconfigure: false,
    start: false,
    stop: false,
    pause: false,
    resume: false,
  };

  ResetState() {
    this.daqButtonState = {
      configure: false,
      unconfigure: false,
      start: false,
      stop: false,
      pause: false,
      resume: false,
    };
  }

  onGetStatus() {
    if (this.checkStatusFlag) {
      this.delila.getStatus().subscribe((response) => {
        if (response === undefined) {
          this.connFlag = false;
        } else {
          this.connFlag = true;
          this.delilaStatus$ = response.response;
          this.statusChange.emit(this.delilaStatus$);
          this.logs = this.delilaStatus$.returnValue.logs["log"];
          const state = this.logs[0].state;
          switch (state) {
            case "LOADED":
              this.ResetState();
              this.daqButtonState.configure = true;
              break;

            case "CONFIGURED":
              this.ResetState();
              this.daqButtonState.start = true;
              this.daqButtonState.unconfigure = true;
              break;

            case "RUNNING":
              this.ResetState();
              this.daqButtonState.stop = true;
              this.daqButtonState.pause = true;
              break;

            case "PAUSED":
              this.ResetState();
              this.daqButtonState.start = true;
              this.daqButtonState.resume = true;
              break;

            default:
              break;
          }
        }
      });
    }
  }

  onPostConfig() {
    this.checkStatusFlag = false;
    this.delila.postConfig().subscribe((response) => {
      console.log("Config posted", response);
      this.checkStatusFlag = true;
      this.onGetStatus();
    });
  }

  onPostUnconfig() {
    this.checkStatusFlag = false;
    this.delila.postUnconfig().subscribe((response) => {
      console.log("Unconfig posted", response);
      this.checkStatusFlag = true;
      this.onGetStatus();
    });
  }

  onPostStart() {
    this.checkStatusFlag = false;
    this.runNo = this.nextRunNo;
    this.nextRunNo = this.autoIncFlag ? this.nextRunNo + 1 : this.nextRunNo;
    this.delila.postStart(this.runNo).subscribe((response) => {
      console.log("Start posted", response);
      this.createRecord();
      this.checkStatusFlag = true;
      this.onGetStatus();
      this.getRunLog(this.recordLength);
    });
  }

  onPostStop() {
    this.checkStatusFlag = false;
    this.spinnerFlag = true;
    this.daqButtonState.stop = false;
    this.delila.postStop().subscribe((response) => {
      console.log("Stop posted", response);
      this.updateRecord();
      this.checkStatusFlag = true;
      this.onGetStatus();
      this.spinnerFlag = false;
      this.getRunLog(this.recordLength);
    });
  }

  onPostConfigAndStart(runNo: number) {
    this.delila.postConfigAndStart(runNo).subscribe((response) => {
      console.log("Config and start posted", response);
    });
  }

  onPostStopAndUnconfig() {
    this.delila.postStopAndUnconfig().subscribe((response) => {
      console.log("Stop and unconfig posted", response);
    });
  }

  onPostDryRun() {
    this.delila.postDryRun().subscribe((response) => {
      console.log("Dry run posted", response);
    });
  }

  createRecord() {
    this.currentRun.runNumber = this.runNo;
    this.currentRun.start = Date.now();
    this.currentRun.stop = 0;
    this.delila.createRecord(this.currentRun).subscribe((response) => {
      console.log("Record created", response);
    });
  }

  updateRecord() {
    this.currentRun.stop = Date.now();
    this.delila.updateRecord(this.currentRun).subscribe((response) => {
      console.log("Record updated", response);
    });
  }

  getRunLog(size: number) {
    this.delila
      .getRunLog(this.currentRun.expName, size)
      .subscribe((response) => {
        this.runRecord$ = response;
        this.runRecordChange.emit(this.runRecord$);
        if (this.runRecord$?.length > 0) {
          this.currentRun.runNumber = this.runRecord$[0].runNumber;
          if (this.autoIncFlag) {
            this.nextRunNo = this.currentRun.runNumber + 1;
          }
          this.currentRun = this.runRecord$[0];
        }
      });
  }
}
