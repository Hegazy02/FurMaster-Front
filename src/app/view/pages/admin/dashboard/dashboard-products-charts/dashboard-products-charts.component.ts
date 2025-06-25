import { Component, inject, ViewChild } from '@angular/core';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { PrimaryTableComponent } from '../../components/primary-table/primary-table.component';
import { PrimaryTableRowComponent } from '../../components/primary-table-row/primary-table-row.component';
import { currency } from '../../../../../core/constants/vairables';
import { StatisticsService } from '../../../../../core/services/statistics.service';
import { Subject, takeUntil } from 'rxjs';
import { BestSellingProductsResponse } from '../../../../../core/interfaces/total-orders-statistics.interface';

type ApexXAxis = {
  type?: 'category' | 'datetime' | 'numeric';
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};

@Component({
  selector: 'app-dashboard-products-charts',
  standalone: true,
  imports: [
    NgApexchartsModule,
    PrimaryTableComponent,
    PrimaryTableRowComponent,
  ],
  templateUrl: './dashboard-products-charts.component.html',
  styleUrl: './dashboard-products-charts.component.css',
})
export class DashboardProductsChartsComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  currency = currency;
  statisticsService = inject(StatisticsService);
  bestSellingProductsByDateResponse?: BestSellingProductsResponse;
  bestSellingProductsResponse?: BestSellingProductsResponse;

  private destroy$ = new Subject<void>();

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Best Selling Products',
          data: [1],
        },
      ],
      chart: {
        height: 200,
        type: 'bar',
        events: {
          click: function (chart, w, e) {},
        },
      },
      colors: [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#775DD0',
        '#546E7A',
        '#26a69a',
        '#D10CE8',
      ],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: [
              '#008FFB',
              '#00E396',
              '#FEB019',
              '#FF4560',
              '#775DD0',
              '#546E7A',
              '#26a69a',
              '#D10CE8',
            ],
            fontSize: '12px',
          },
        },
      },
    };
  }
  ngOnInit(): void {
    this.getBestSellingProductsByDateRange(
      4,
      new Date(new Date().setDate(new Date().getDate() - 7)),
      new Date()
    );
    this.getBestSellingProducts(8);
  }
  getBestSellingProductsByDateRange(limit: number, from: Date, to: Date) {
    this.statisticsService
      .getBestSellingProducts(limit, from, to)
      ?.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.bestSellingProductsByDateResponse = result;
        },
        error: (err) => {
          console.log('customer statistics error', err);
        },
      });
  }
  getBestSellingProducts(limit: number) {
    this.statisticsService
      .getBestSellingProducts(limit)
      ?.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.bestSellingProductsResponse = result;
          this.setChartOptions();
        },
        error: (err) => {
          console.log('customer statistics error', err);
        },
      });
  }
  setChartOptions() {
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: 'Best Selling Products',
          data: this.bestSellingProductsResponse!.data.map(
            (item) => item.totalOrder
          ),
        },
      ],
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: this.bestSellingProductsResponse!.data.map(
          (item) => item.title
        ),
      },
    };
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
