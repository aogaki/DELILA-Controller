import {
  MatDialogModule,
  MatDialogClose,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MatDialog,
} from "@angular/material/dialog";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ControllerComponent } from "../controller.component";

@Component({
  selector: "app-controller-timer",
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatButton,
    MatDialogModule,
    ControllerComponent,
  ],
  templateUrl: "./controller-timer.component.html",
  styleUrl: "./controller-timer.component.css",
})
export class ControllerTimerComponent implements OnInit {
  timeRemaining: number = 0;
  countDownFlag: boolean = false;
  stopFlag: boolean = false;

  constructor(
    private controller: ControllerComponent,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      if (this.countDownFlag) {
        this.countDown();
      }
    }, 1000);
  }

  hour: number = 1;
  minute: number = 0;
  second: number = 0;
  hourInit: number = 1;
  minuteInit: number = 0;
  secondInit: number = 0;
  startTimer() {
    this.hourInit = this.hour;
    this.minuteInit = this.minute;
    this.secondInit = this.second;
    this.timeRemaining = this.hour * 3600 + this.minute * 60 + this.second;
    this.countDownFlag = true;
  }

  stopTimer() {
    this.countDownFlag = false;

    this.hour = this.hourInit;
    this.minute = this.minuteInit;
    this.second = this.secondInit;
  }

  startTimerAndRun() {
    this.startTimer();
    if (this.stopFlag === false) {
      this.controller.onPostConfigAndStart();
      this.stopFlag = true;
    }
  }

  countDown() {
    this.timeRemaining = this.timeRemaining - 1;
    this.hour = Math.floor(this.timeRemaining / 3600);
    this.minute = Math.floor((this.timeRemaining % 3600) / 60);
    this.second = this.timeRemaining % 60;
    if (this.timeRemaining === 0) {
      this.stopTimer();
      if (this.stopFlag) this.controller.onPostStopAndUnconfig();
      this.stopFlag = false;
      this.openDialog();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAnimationsExampleDialog);
    let audio = new Audio("assets/mixkit-battleship-alarm-1001.mp3");
    audio.play();
    dialogRef.afterClosed().subscribe(() => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}

@Component({
  selector: "dialog-animations-example-dialog",
  templateUrl: "./dialog.html",
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
})
export class DialogAnimationsExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
}
