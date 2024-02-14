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
    const filename = "http://localhost:8080/HistFront/root.json.gz";
    let obj = httpRequest(filename, "object").then((obj: any) => {
      cleanup("hist");
      redraw("hist", obj, "hist");
    });

    // this.delila.getHistogram("Brd00/ADC00_00").subscribe((response) => {
    //   let obj = parse(response);
    //   draw("hist", obj, "hist");
    // });
  }
}
