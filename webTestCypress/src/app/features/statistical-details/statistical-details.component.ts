import { Component, OnInit } from '@angular/core';
import { JsonEditorService } from '@app/services/json-editor.service';

@Component({
  selector: 'app-statistical-details',
  templateUrl: './statistical-details.component.html',
  styleUrls: ['./statistical-details.component.scss']
})
export class StatisticalDetailsComponent implements OnInit {
  statistiques: any[] = [];

  constructor(private service: JsonEditorService) { }

  ngOnInit(): void {
    this.getStatistiques()
  }
  getStatistiques() {
    this.service.getStatistiques().subscribe((data: any) => {
      this.statistiques = data
    })
  }
  formatTestResults(results: string): string {
    return results?.replace(/\n/g, '<br>');
  }
}
