import { Component } from '@angular/core';
import { DashboardTotalsComponent } from "./dashboard-totals/dashboard-totals.component";
import { DashboardGenderChartComponent } from "./dashboard-gender-chart/dashboard-gender-chart.component";
import { DashboardProductsChartsComponent } from "./dashboard-products-charts/dashboard-products-charts.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardTotalsComponent, DashboardGenderChartComponent, DashboardProductsChartsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
