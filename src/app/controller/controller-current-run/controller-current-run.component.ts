import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatListModule } from "@angular/material/list";

import { RunLog } from "../../run-log";

@Component({
  selector: "app-controller-current-run",
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: "./controller-current-run.component.html",
  styleUrl: "./controller-current-run.component.css",
})
export class ControllerCurrentRunComponent {
  @Input() currentRun!: RunLog;
}
