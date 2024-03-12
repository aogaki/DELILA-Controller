import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { DelilaButton } from "../../delila-response";
import { ControllerComponent } from "../controller.component";

@Component({
  selector: "app-controller-input",
  standalone: true,
  imports: [
    MatCheckbox,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    ControllerComponent,
  ],
  templateUrl: "./controller-input.component.html",
  styleUrl: "./controller-input.component.css",
})
export class ControllerInputComponent {
  @Input() nextRunNo: number = 1;
  @Output() nextRunNoChange = new EventEmitter<number>();
  onChangeNextRunNo() {
    this.nextRunNoChange.emit(this.nextRunNo);
  }

  @Input() autoIncFlag!: boolean;
  @Output() autoIncFlagChange = new EventEmitter<boolean>();
  onChangeAutoIncFlag(event: any) {
    this.autoIncFlag = event.checked;
    this.autoIncFlagChange.emit(this.autoIncFlag);
  }

  @Input() source!: string;
  @Output() sourceChange = new EventEmitter<string>();
  onChangeSource() {
    this.sourceChange.emit(this.source);
  }

  @Input() distance!: string;
  @Output() distanceChange = new EventEmitter<string>();
  onChangeDistance() {
    this.distanceChange.emit(this.distance);
  }

  @Input() comment!: string;
  @Output() commentChange = new EventEmitter<string>();
  onChangeComment() {
    this.commentChange.emit(this.comment);
  }

  @Input() buttonState!: DelilaButton;

  @Input() spinnerFlag!: boolean;

  devMode: boolean = true;

  constructor(
    private controller: ControllerComponent,
    private location: Location
  ) {
    this.devMode = this.location.path() === "/dev";
  }

  onPostConfig() {
    this.controller.onPostConfig();
  }

  onPostUnconfig() {
    this.controller.onPostUnconfig();
  }

  onPostStart() {
    this.controller.onPostStart();
  }

  onPostStop() {
    this.controller.onPostStop();
  }

  onPostConfigAndStart() {
    this.controller.onPostConfigAndStart();
  }

  onPostStopAndUnconfig() {
    this.controller.onPostStopAndUnconfig();
  }

  onPostDryRun() {
    this.controller.onPostDryRun();
  }
}
