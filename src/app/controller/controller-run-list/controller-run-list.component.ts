import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";

import { RunLog } from "../../run-log";

@Component({
  selector: "app-controller-run-list",
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatListModule],
  templateUrl: "./controller-run-list.component.html",
  styleUrl: "./controller-run-list.component.css",
})
export class ControllerRunListComponent {
  @Input() runRecord!: RunLog[];
}
