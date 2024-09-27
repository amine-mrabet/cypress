import { Component } from '@angular/core';
import { JsonEditorService } from '@app/services/json-editor.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  Statistiques: any[] = [];
  
  constructor(private service: JsonEditorService) { }
  ngOnInit(): void {
    this.getStatistiques()
  }
  getStatistiques() {
    this.service.getStatistiques().subscribe((data: any) => {
      this.Statistiques = data
    })
  }
  setupChart(data:any) {
    return [data.passed, data.failed]
  }
}
