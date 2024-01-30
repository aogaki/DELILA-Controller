import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DelilaService } from './delila.service';
import { DelilaStatus } from './delila-response';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'DELILA-Controller';

  private readonly delila = inject(DelilaService);

  status$!: DelilaStatus;

  updateStatus() {
    this.delila.getStatus().subscribe((response) => {
      this.status$ = response.response;
      // console.log('Status updated', this.status$);
    });
  }

  postConfig() {
    this.delila.postConfig().subscribe((response) => {
      console.log('Config posted', response);
    });
  }

  postUnconfig() {
    this.delila.postUnconfig().subscribe((response) => {
      console.log('Unconfig posted', response);
    });
  }

  postStart(runNo: number) {
    this.delila.postStart(runNo).subscribe((response) => {
      console.log('Start posted', response);
    });
  }

  postStop() {
    this.delila.postStop().subscribe((response) => {
      console.log('Stop posted', response);
    });
  }

  postConfigAndStart(runNo: number) {
    this.delila.postConfigAndStart(runNo).subscribe((response) => {
      console.log('Config and start posted', response);
    });
  }

  postStopAndUnconfig() {
    this.delila.postStopAndUnconfig().subscribe((response) => {
      console.log('Stop and unconfig posted', response);
    });
  }

  postDryRun() {
    this.delila.postDryRun().subscribe((response) => {
      console.log('Dry run posted', response);
    });
  }

  constructor() {}
}
