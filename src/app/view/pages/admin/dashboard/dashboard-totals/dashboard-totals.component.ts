import { NgStyle } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { currency } from '../..//../../../core/constants/vairables';
import { StatisticsService } from '../../../../../core/services/statistics.service';
import { Subject, takeUntil } from 'rxjs';
import {
  TotalOrdersAmountStatistics,
  TotalOrdersStatistics,
} from '../../../../../core/interfaces/total-orders-statistics.interface';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
@Component({
  selector: 'app-dashboard-totals',
  standalone: true,
  imports: [NgApexchartsModule, NgStyle],
  templateUrl: './dashboard-totals.component.html',
  styleUrl: './dashboard-totals.component.css',
})
export class DashboardTotalsComponent implements OnInit {
  statisticsService = inject(StatisticsService);
  @ViewChild('chart') chart!: ChartComponent;
  public totalOrdersChartOptions: Partial<ChartOptions>;
  public totalOrdersAmountChartOptions: Partial<ChartOptions>;
  currency = currency;
  totalOrdersStatistics?: TotalOrdersStatistics;
  totalOrdersAmountStatistics?: TotalOrdersAmountStatistics;
  destroy$ = new Subject<void>();
  totalOrdersStatisticsFrom = new Date(
    new Date().setDate(new Date().getDate() - 7)
  );
  totalOrdersStatisticsTo = new Date();
  constructor() {
    this.totalOrdersChartOptions = {
      series: [
        {
          name: 'Total Orders',
          data: [{ x: new Date(), y: 55 }],
        },
      ],
      chart: {
        width: 350,
        height: 100,
        type: 'area',
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        type: 'datetime',
        categories: [],
      },
    };
    this.totalOrdersAmountChartOptions = {
      series: [
        {
          name: 'Total Orders Amount',
          data: [{ x: new Date(), y: 55 }],
        },
      ],
      chart: {
        width: 350,
        height: 100,
        type: 'area',
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        type: 'datetime',
        categories: [],
      },
    };
  }
  ngOnInit(): void {
    this.getTotalOrdersStatistics(
      this.totalOrdersStatisticsFrom,
      this.totalOrdersStatisticsTo
    );
    this.getTotalOrdersAmountStatistics(
      this.totalOrdersStatisticsFrom,
      this.totalOrdersStatisticsTo
    );
  }

  private setTotalOrdersStatistics(
    totalOrdersStatistics: TotalOrdersStatistics
  ) {
    this.totalOrdersChartOptions = {
      ...this.totalOrdersChartOptions,
      series: [
        {
          name: 'Total Orders',
          data: totalOrdersStatistics.dailyCounts.map((dailyCount) => {
            return { x: new Date(dailyCount.date), y: dailyCount.count };
          }),
        },
      ],
    };
  }
  private setTotalOrdersAmountStatistics(
    totalOrdersAmountStatistics: TotalOrdersAmountStatistics
  ) {
    this.totalOrdersAmountChartOptions = {
      ...this.totalOrdersAmountChartOptions,
      series: [
        {
          name: 'Total Orders Amount',
          data: totalOrdersAmountStatistics.dailyTotals.map((dailyTotal) => {
            return { x: new Date(dailyTotal.date), y: dailyTotal.totalOrders };
          }),
        },
      ],
    };
  }

  getTotalOrdersStatistics(from: Date, to: Date) {
    this.statisticsService
      .getTotalOrdersStatistics(from, to)
      ?.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.totalOrdersStatistics = result.data;

          this.setTotalOrdersStatistics(this.totalOrdersStatistics!);
        },
        error: (error) => console.error(error),
      });
  }
  getTotalOrdersAmountStatistics(from: Date, to: Date) {
    this.statisticsService
      .getTotalOrdersAmountStatistics(from, to)
      ?.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.totalOrdersAmountStatistics = result.data;
     

          this.setTotalOrdersAmountStatistics(
            this.totalOrdersAmountStatistics!
          );
        },
        error: (error) => console.error(error),
      });
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
