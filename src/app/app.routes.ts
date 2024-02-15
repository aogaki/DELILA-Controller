import { Routes } from "@angular/router";
import { ControllerComponent } from "./controller/controller.component";
import { MonitorComponent } from "./monitor/monitor.component";

export const routes: Routes = [
  { path: "controller", component: ControllerComponent },
  { path: "monitor", component: MonitorComponent },
  { path: "", redirectTo: "/controller", pathMatch: "full" },
];
