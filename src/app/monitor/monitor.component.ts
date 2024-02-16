import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { DelilaService } from '../delila.service';
import { MonitorLinks } from '../monitor-links';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css',
})
export class MonitorComponent {
  links!: MonitorLinks[];

  constructor(private delila: DelilaService) {
    this.delila.getMonitorLinks().subscribe((response) => {
      this.links = response;
      console.log('links', this.links);
    });
  }
}
