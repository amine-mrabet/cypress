import { Component, Input, OnChanges, SimpleChanges,OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit{
  @Input() data: any = undefined
  chart: { labels: string[]; datasets: { data: number[]; backgroundColor: string[]; hoverBackgroundColor: string[]; }[]; } | undefined;
  options: { plugins: { legend: { display: boolean; labels: { usePointStyle: boolean; color: any }; }; }; } | undefined;

  constructor() {

  }
  ngOnInit(): void {
    this.chart = { labels: ['Passed', 'Failed'], datasets: [{ data: this.data, backgroundColor: ['#059150', '#ff0000'], hoverBackgroundColor: ['#059150', '#ff0000'] }] }
    this.options = {
      plugins: {
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            color: 'white'

          }
        }
      }
    };
  }

}
