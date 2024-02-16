import { DelilaService } from './../delila.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControllerButtonComponent } from './controller-button/controller-button.component';
import { DelilaStatus } from '../delila-response';
import { RunLog } from '../run-log';
import { ControllerCurrentRunComponent } from './controller-current-run/controller-current-run.component';
import { ControllerDelilaStatusComponent } from './controller-delila-status/controller-delila-status.component';
import { ControllerRunListComponent } from './controller-run-list/controller-run-list.component';

@Component({
  selector: 'app-controller',
  standalone: true,
  imports: [
    CommonModule,
    ControllerButtonComponent,
    ControllerCurrentRunComponent,
    ControllerDelilaStatusComponent,
    ControllerRunListComponent,
  ],
  templateUrl: './controller.component.html',
  styleUrl: './controller.component.css',
})
export class ControllerComponent implements OnInit {
  computerName = 'localhost';
  expName = 'test';

  status!: DelilaStatus;
  updateStatus(status: DelilaStatus) {
    this.status = status;
  }

  currentRun!: RunLog;
  runRecord!: RunLog[];
  updateRunRecord(runRecord: RunLog[]) {
    if (runRecord.length > 0) {
      this.runRecord = runRecord;
      this.currentRun = runRecord[0];
    }
  }

  constructor(private delila: DelilaService) {}

  ngOnInit() {
    this.delila.loadExperimentSettings().subscribe((response) => {
      this.expName = response.expName;
      this.computerName = response.computerName;
    });
  }
}
