import { Component, Input } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { CommonModule } from "@angular/common";

import { DelilaStatus } from "../../delila-response";
import { GroupMaskPipe } from "./group-mask.pipe";

@Component({
  selector: "app-controller-delila-status",
  standalone: true,
  templateUrl: "./controller-delila-status.component.html",
  styleUrl: "./controller-delila-status.component.css",
  imports: [CommonModule, MatTableModule, GroupMaskPipe],
})
export class ControllerDelilaStatusComponent {
  @Input() status!: DelilaStatus;
  displayedColumns: string[] = ["compName", "state", "eventNum", "compStatus"];
}
