import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { DelilaService } from "./delila.service";
import { DelilaStatus } from "./delila-response";
import { RunLog } from "./run-log";
import { FormsModule } from "@angular/forms";
import { httpRequest, draw, redraw, resize, cleanup, parse } from "jsroot";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "DELILA-Controller";
  computerName = "localhost";

  // constructor() {}
  constructor(private delila: DelilaService) {}

  // private readonly delila = inject(DelilaService);
  ngOnInit() {
    this.delila.loadServerSettings();
    this.delila.loadExperimentSettings().subscribe((response) => {
      console.log("Experiment settings loaded", response);
      this.runLog.expName = response.expName;
      this.computerName = response.computerName;
    });

    setInterval(() => {
      this.getHist();
    }, 1000);
  }

  status$!: DelilaStatus;
  runLog: RunLog = {
    runNumber: 1234,
    start: 0,
    stop: 0,
    expName: "",
    comment: "",
    source: "",
    distance: "",
  };
  runNo = -1;

  updateStatus() {
    this.delila.getStatus().subscribe((response) => {
      this.status$ = response.response;
      // console.log('Status updated', this.status$);
    });
  }

  postConfig() {
    this.delila.postConfig().subscribe((response) => {
      console.log("Config posted", response);
    });
  }

  postUnconfig() {
    this.delila.postUnconfig().subscribe((response) => {
      console.log("Unconfig posted", response);
    });
  }

  postStart(runNo: number) {
    this.delila.postStart(runNo).subscribe((response) => {
      console.log("Start posted", response);
    });
  }

  postStop() {
    this.delila.postStop().subscribe((response) => {
      console.log("Stop posted", response);
    });
  }

  postConfigAndStart(runNo: number) {
    this.delila.postConfigAndStart(runNo).subscribe((response) => {
      console.log("Config and start posted", response);
    });
  }

  postStopAndUnconfig() {
    this.delila.postStopAndUnconfig().subscribe((response) => {
      console.log("Stop and unconfig posted", response);
    });
  }

  postDryRun() {
    this.delila.postDryRun().subscribe((response) => {
      console.log("Dry run posted", response);
    });
  }

  createRecord() {
    this.runLog.runNumber = this.runNo;
    this.runLog.start = Date.now();
    this.delila.createRecord(this.runLog).subscribe((response) => {
      console.log("Record created", response);
    });
  }

  updateRecord() {
    this.runLog.stop = Date.now();
    this.delila.updateRecord(this.runLog).subscribe((response) => {
      console.log("Record updated", response);
    });
  }

  records$?: RunLog[];
  getRunLog(size: number) {
    this.delila.getRunLog(this.runLog.expName, size).subscribe((response) => {
      console.log("Records retrieved", response);
      this.records$ = response;
    });
  }

  getHist() {
    const filename = "http://localhost:8080/HistFront/root.json.gz";
    let obj = httpRequest(filename, "object").then((obj: any) => {
      cleanup("hist");
      redraw("hist", obj, "hist");
    });

    // this.delila.getHistogram("Brd00/ADC00_00").subscribe((response) => {
    //   let obj = parse(response);
    //   draw("hist", obj, "hist");
    // });
  }
}
