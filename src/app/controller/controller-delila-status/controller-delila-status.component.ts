import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { DelilaStatus } from '../../delila-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-controller-delila-status',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './controller-delila-status.component.html',
  styleUrl: './controller-delila-status.component.css',
})
export class ControllerDelilaStatusComponent {
  @Input() status!: DelilaStatus;
  displayedColumns: string[] = ['compName', 'state', 'eventNum', 'compStatus'];
}
