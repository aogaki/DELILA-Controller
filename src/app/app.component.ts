import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { httpRequest, draw, redraw, resize, cleanup, parse } from "jsroot";
import { ControllerComponent } from "./controller/controller.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, ControllerComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "DELILA-Controller";

  constructor() {}

  getHist() {
    const filename = "http://172.18.4.77:8080/SiHist_front/root.json.gz";
    let obj = httpRequest(filename, "object").then((obj: any) => {
      cleanup("hist");
      redraw("hist", obj, "hist");
    });
  }
}
