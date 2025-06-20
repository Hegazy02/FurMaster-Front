import { NgClass, NgStyle } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
import { currency } from '../../../../core/constants/vairables';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgApexchartsModule, NgClass,NgStyle],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  currency = currency;
  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'series1',
          // data: [31, 40, 28, 51, 42, 109, 100],
          data: [
            {
              x: new Date(1538778600000),
              y: 31,
            },
            {
              x: new Date(1638778600000),
              y: 40,
            },
          ],
        },
        // {
        //   name: 'series2',
        //   data: [11, 32, 45, 32, 34, 52, 41],
        // },
      ],
      chart: {
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
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z',
        ],
      },
      tooltip: {
        fillSeriesColor: true,
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
  }
  totals = [
    { title: 'Total Orders', subtitle: 'Last 7 days', amount: 200, effect: -6 },
    {
      title: 'Total Revenue',
      subtitle: 'Last 7 days',
      amount: 10500,
      effect: 8,
    },
  ];
  public generateData(baseval: number, count: number, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
}
