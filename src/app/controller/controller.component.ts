import { DelilaService } from "./../delila.service";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControllerButtonComponent } from "./controller-button/controller-button.component";

@Component({
  selector: "app-controller",
  standalone: true,
  imports: [CommonModule, ControllerButtonComponent],
  templateUrl: "./controller.component.html",
  styleUrl: "./controller.component.css",
})
export class ControllerComponent {
  computerName = "localhost";
  expName = "test";

  constructor(private delila: DelilaService) {}

  ngOnInit() {
    this.delila.loadExperimentSettings().subscribe((response) => {
      this.expName = response.expName;
      this.computerName = response.computerName;
    });
  }
}
