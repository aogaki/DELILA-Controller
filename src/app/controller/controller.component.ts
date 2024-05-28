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
import { Observable, timer } from "rxjs";

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
    if (window.innerWidth >= 1400) {
      this.nCols = 4;
    } else {
      if (window.innerWidth >= 800) {
        this.nCols = 2;
      } else {
        this.nCols = 1;
      }
    }

    this.delila.loadServerSettings();
    this.delila.loadExperimentSettings().subscribe((response) => {
      this.expName = this.currentRun.expName = response.expName;
      this.computerName = response.computerName;

      this.getRunLog(this.recordLength);
      this.getStatus();
    });

    setInterval(() => {
      if (this.appVisibility() && this.checkStatusFlag) this.getStatus();
    }, this.updateInterval);
  }

  nCols = 2;
  onResize(event: any) {
    if (event.target.innerWidth >= 1400) {
      this.nCols = 4;
    } else {
      if (event.target.innerWidth >= 800) {
        this.nCols = 2;
      } else {
        this.nCols = 1;
      }
    }
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
    this.delila.getStatus().subscribe((response) => {
      if (response === undefined) {
        this.connFlag = false;
      } else if ((response as any).status == "busy") {
        // DAQ-Middleware is busy.  Do nothing.
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

    if (this.autoIncFlag === true && this.currentRun.expName !== "") {
      this.delila
        .getRunLog(this.currentRun.expName, 1)
        .subscribe((response) => {
          if (response.length > 0) {
            this.currentRun.runNumber = response[0].runNumber;
            if (this.autoIncFlag) {
              this.nextRunNo = this.currentRun.runNumber + 1;
            }
            this.currentRun.start = response[0].start;
            this.currentRun.stop = response[0].stop;
          }
        });
    }
  }

  onPostConfig() {
    this.spinnerFlag = true;
    this.delila.postConfig().subscribe((response) => {
      console.log("Config posted", response);
      this.checkStatusFlag = true;
      this.getStatus();
      this.spinnerFlag = false;
    });
  }

  onPostUnconfig() {
    this.delila.postUnconfig().subscribe((response) => {
      console.log("Unconfig posted", response);
      this.checkStatusFlag = true;
      this.getStatus();
    });
  }

  onPostStart() {
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
    this.spinnerFlag = true;
    this.daqButtonState.stop = false;
    this.updateRecord().subscribe((response) => {
      this.delila.postStop().subscribe((response) => {
        console.log("Stop posted", response);
        this.getRunLog(this.recordLength);
        this.spinnerFlag = false;
        this.checkStatusFlag = true;
        this.getStatus();
      });
    });
  }

  // onPostConfigAndStart() {
  //   this.runNo = this.nextRunNo;
  //   this.nextRunNo = this.autoIncFlag ? this.nextRunNo + 1 : this.nextRunNo;
  //   this.spinnerFlag = true;
  //   this.delila.postConfig().subscribe((response) => {
  //     console.log("Config posted", response);
  //     timer(1000).subscribe(() => {
  //       this.delila.postStart(this.runNo).subscribe((response) => {
  //         console.log("Start posted", response);
  //         this.createRecord();
  //         this.checkStatusFlag = true;
  //         this.getStatus();
  //         this.getRunLog(this.recordLength);
  //         this.spinnerFlag = false;
  //       });
  //     });
  //   });
  // }

  onPostConfigAndStart() {
    this.runNo = this.nextRunNo;
    this.nextRunNo = this.autoIncFlag ? this.nextRunNo + 1 : this.nextRunNo;
    this.spinnerFlag = true;
    this.delila.postConfigAndStart(this.runNo).subscribe((response) => {
      console.log("Config and start posted", response);
      this.createRecord();
      this.checkStatusFlag = true;
      this.getStatus();
      this.getRunLog(this.recordLength);
      this.spinnerFlag = false;
    });
  }

  onPostStopAndUnconfig() {
    this.spinnerFlag = true;
    this.daqButtonState.stop = false;
    this.updateRecord().subscribe((response) => {
      this.delila.postStopAndUnconfig().subscribe((response) => {
        console.log("Stop and unconfig posted", response);
        this.getRunLog(this.recordLength);
        this.spinnerFlag = false;
        this.checkStatusFlag = true;
        this.getStatus();
      });
    });
  }

  whenStopFailed() {
    this.delila.updateRecord(this.currentRun).subscribe((response) => {
      console.log("Record updated", response, this.currentRun);
    });
    this.spinnerFlag = false;
    this.getRunLog(this.recordLength);
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
    console.log("Creating record", this.nextRunNo);
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

  updateRecord(): Observable<RunLog> {
    this.currentRun.stop = Date.now();
    this.currentRun.source = this.source;
    this.currentRun.distance = this.distance;
    this.currentRun.comment = this.comment;
    // return this.delila.updateRecord(this.currentRun).subscribe((response) => {
    //   console.log("Record updated", response, this.currentRun);
    // });

    return this.delila.updateRecord(this.currentRun);
  }
}
