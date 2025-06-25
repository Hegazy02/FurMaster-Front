import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';
import { CustomerGenderStatistics } from '../../../../../core/interfaces/customer-gender-statistics.interface';
import { StatisticsService } from '../../../../../core/services/statistics.service';
import { Subject, takeUntil } from 'rxjs';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
export type DetailsChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
@Component({
  selector: 'app-dashboard-gender-chart',
  standalone: true,
  templateUrl: './dashboard-gender-chart.component.html',
  styleUrl: './dashboard-gender-chart.component.css',
  imports: [NgApexchartsModule],
})
export class DashboardGenderChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  @ViewChild('details') detailsChart!: ChartComponent;
  public detailsChartOptions: Partial<DetailsChartOptions>;
  private customerGenderStatistics!: CustomerGenderStatistics;
  statisticsService = inject(StatisticsService);
  private destroy$ = new Subject<void>();

  constructor() {
    this.chartOptions = {
      series: [1, 1],
      chart: {
        width: 400,
        type: 'donut',
      },
      labels: ['Male', 'Female'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 100,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
    this.detailsChartOptions = {
      series: [
        {
          name: 'Male',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
          name: 'Female',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yaxis: {
        title: {
          text: 'Total',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toString();
          },
        },
      },
    };
  }
  ngOnInit(): void {
    this.getCustomerGenderStatistics();
  }
  getCustomerGenderStatistics() {
    this.statisticsService
      .getCustomerGenderStatistics()
      ?.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.customerGenderStatistics = result.data;
          this.setChartOptions();
          this.setDetailsChartOptions();
        },
        error: (err) => {
          console.log('customer statistics error', err);
        },
      });
  }
  setChartOptions() {
    this.chartOptions.series = [
      this.customerGenderStatistics.total.male,
      this.customerGenderStatistics.total.female,
    ];
  }
  setDetailsChartOptions() {
    this.detailsChartOptions.series = [
      {
        name: 'Male',
        data: this.customerGenderStatistics.monthly.map((item) => item.male),
      },
      {
        name: 'Female',
        data: this.customerGenderStatistics.monthly.map((item) => item.female),
      },
    ];
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
