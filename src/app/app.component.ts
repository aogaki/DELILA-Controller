import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterOutlet } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

import { httpRequest, draw, redraw, resize, cleanup, parse } from "jsroot";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonToggleModule,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "DELILA-Controller";
  localtion!: string;

  constructor(private router: Router) {}
  ngOnInit() {
    this.onClickController();
  }

  onClickController() {
    this.localtion = "controller";
    this.router.navigate([this.localtion]);
  }

  onClickMonitor() {
    this.localtion = "monitor";
    this.router.navigate([this.localtion]);
  }

  getHist() {
    const filename = "http://172.18.4.77:8080/SiHist_front/root.json.gz";
    let obj = httpRequest(filename, "object").then((obj: any) => {
      cleanup("hist");
      redraw("hist", obj, "hist");
    });
  }
}
