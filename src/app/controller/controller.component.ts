import { Component, OnInit, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";

import { DelilaStatus, compStatus, DelilaButton } from "../delila-response";
import { RunLog } from "../run-log";
import { ControllerCurrentRunComponent } from "./controller-current-run/controller-current-run.component";
import { ControllerDelilaStatusComponent } from "./controller-delila-status/controller-delila-status.component";
import { ControllerRunListComponent } from "./controller-run-list/controller-run-list.component";
import { DelilaService } from "./../delila.service";
import { ControllerInputComponent } from "./controller-input/controller-input.component";
import { ControllerTimerComponent } from "./controller-timer/controller-timer.component";

@Component({
  selector: "app-controller",
  standalone: true,
  imports: [
    CommonModule,
    ControllerCurrentRunComponent,
    ControllerDelilaStatusComponent,
    ControllerRunListComponent,
    ControllerInputComponent,
    ControllerTimerComponent,

    MatGridListModule,
  ],
  templateUrl: "./controller.component.html",
  styleUrl: "./controller.component.css",
})
export class ControllerComponent implements OnInit {
  @HostListener("document:visibilitychange", ["$event"])
  appVisibility(): boolean {
    if (document.hidden) {
      return false;
    } else {
      return true;
    }
  }

  computerName = "localhost";
  expName = "test";

  nextRunNo: number = 1;
  runNo = -1;
  autoIncFlag: boolean = true;
  connFlag: boolean = false;
  checkStatusFlag: boolean = true;
  spinnerFlag: boolean = false;
  logs: compStatus[] = [];

  currentRun: RunLog = {
    runNumber: 0,
    start: 0,
    stop: 0,
    expName: "",
    source: "",
    distance: "",
    comment: "",
  };
  runRecord: RunLog[] = [];

  constructor(private delila: DelilaService) {}

  recordLength = 10;
  updateInterval = 1000;
  ngOnInit() {
    this.delila.loadServerSettings();
    this.delila.loadExperimentSettings().subscribe((response) => {
      this.expName = this.currentRun.expName = response.expName;
      this.computerName = response.computerName;

      this.getRunLog(this.recordLength);
      this.getStatus();
    });

    setInterval(() => {
      if (this.appVisibility()) this.getStatus();
    }, this.updateInterval);
  }

  source: string = "";
  distance: string = "";
  comment: string = "";
  getRunLog(size: number) {
    this.delila
      .getRunLog(this.currentRun.expName, size)
      .subscribe((response) => {
        this.runRecord = response;
        if (this.runRecord?.length > 0) {
          this.currentRun.runNumber = this.runRecord[0].runNumber;
          if (this.autoIncFlag) {
            this.nextRunNo = this.currentRun.runNumber + 1;
          }
          this.currentRun = this.runRecord[0];
          this.source = this.currentRun.source;
          this.distance = this.currentRun.distance;
          this.comment = this.currentRun.comment;
        }
      });
  }

  daqButtonState: DelilaButton = {
    configure: false,
    unconfigure: false,
    start: false,
    stop: false,
    pause: false,
    resume: false,
    confAndStart: false,
    stopAndUnconf: false,
  };

  ResetState() {
    this.daqButtonState = {
      configure: false,
      unconfigure: false,
      start: false,
      stop: false,
      pause: false,
      resume: false,
      confAndStart: false,
      stopAndUnconf: false,
    };
  }

  delilaStatus$!: DelilaStatus;
  getStatus() {
    if (this.checkStatusFlag) {
      this.delila.getStatus().subscribe((response) => {
        if (response === undefined) {
          this.connFlag = false;
        } else {
          this.connFlag = true;
          this.delilaStatus$ = response.response;
          this.logs = this.delilaStatus$.returnValue.logs["log"];
          const state = this.logs[0].state;
          switch (state) {
            case "LOADED":
              this.ResetState();
              this.daqButtonState.configure = true;
              this.daqButtonState.confAndStart = true;
              break;

            case "CONFIGURED":
              this.ResetState();
              this.daqButtonState.start = true;
              this.daqButtonState.unconfigure = true;
              this.daqButtonState.confAndStart = true;
              break;

            case "RUNNING":
              this.ResetState();
              this.daqButtonState.stop = true;
              this.daqButtonState.pause = true;
              this.daqButtonState.stopAndUnconf = true;
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
      this.getStatus();
    });
  }

  onPostUnconfig() {
    this.checkStatusFlag = false;
    this.delila.postUnconfig().subscribe((response) => {
      console.log("Unconfig posted", response);
      this.checkStatusFlag = true;
      this.getStatus();
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
      this.getStatus();
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
      this.getStatus();
      this.spinnerFlag = false;
      this.getRunLog(this.recordLength);
      this.checkStatusFlag = true;
    });
  }

  onPostConfigAndStart() {
    this.checkStatusFlag = false;
    this.runNo = this.nextRunNo;
    this.nextRunNo = this.autoIncFlag ? this.nextRunNo + 1 : this.nextRunNo;
    this.delila.postConfigAndStart(this.runNo).subscribe((response) => {
      console.log("Config and start posted", response);
      this.createRecord();
      this.checkStatusFlag = true;
      this.getStatus();
      this.getRunLog(this.recordLength);
    });
  }

  onPostStopAndUnconfig() {
    this.checkStatusFlag = false;
    this.spinnerFlag = true;
    this.daqButtonState.stop = false;
    this.delila.postStopAndUnconfig().subscribe((response) => {
      console.log("Stop and unconfig posted", response);
      this.updateRecord();
      this.getStatus();
      this.spinnerFlag = false;
      this.getRunLog(this.recordLength);
      this.checkStatusFlag = true;
    });
  }

  onPostDryRun() {
    this.checkStatusFlag = false;
    this.delila.postDryRun().subscribe((response) => {
      console.log("Dry run posted", response);
      this.checkStatusFlag = true;
      this.getStatus();
      this.getRunLog(this.recordLength);
    });
  }

  createRecord() {
    this.currentRun.runNumber = this.runNo;
    this.currentRun.start = Date.now();
    this.currentRun.stop = 0;
    this.currentRun.source = this.source;
    this.currentRun.distance = this.distance;
    this.currentRun.comment = this.comment;
    this.delila.createRecord(this.currentRun).subscribe((response) => {
      console.log("Record created", response);
    });
  }

  updateRecord() {
    this.currentRun.stop = Date.now();
    this.currentRun.source = this.source;
    this.currentRun.distance = this.distance;
    this.currentRun.comment = this.comment;
    this.delila.updateRecord(this.currentRun).subscribe((response) => {
      console.log("Record updated", response, this.currentRun);
    });
  }
}
