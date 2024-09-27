import { Component, OnInit } from '@angular/core';
import { JsonEditorService } from '@app/services/json-editor.service';

@Component({
  selector: 'app-run-cypress',
  templateUrl: './run-cypress.component.html',
  styleUrls: ['./run-cypress.component.scss']
})
export class RunCypressComponent implements OnInit {
  folders: any[] = []
  folder: any
  showVideo: boolean = false
  log: any
  Statistiques: any;
  videoUrl: string = '';
  constructor(private service: JsonEditorService) { }

  ngOnInit(): void {
    this.getFolders()
    this.getStatistiques()
  }
  getStatistiques() {
    this.service.getStatistiques().subscribe((data: any) => {
      this.Statistiques = data
    })
  }
  getFolders() {
    this.service.getFolders().subscribe((folders: any) => {
      folders.forEach((element: any) => {
        let name = element.replace(/-/g, " ")
        this.folders.push({ name: name, code: element })
      })
    })
  }
  runCypress() {
    this.service.runCypress(this.folder.code).subscribe(data => {
      console.log(this.Statistiques)
      this.updateFileStatistiques(data.message, data.socialReason, true)
      this.log = data.message
    }, (error => {
      console.log(error)
      this.updateFileStatistiques(error.error.error, error.error.socialReason, false)
      this.showVideo = false
      this.fetchVideo()
    }), () => {
      this.showVideo = false
      this.fetchVideo()
    })
  }

  fetchVideo() {
    this.service.getVideos(this.folder.code)
      .subscribe((response: Blob) => {
        const blob = new Blob([response], { type: 'video/mp4' });
        this.videoUrl = URL.createObjectURL(blob);
        this.showVideo = true;
      }, (error => {
        this.videoUrl = '';
        this.showVideo = false;
      }));
  }

  formatTestResults(results: string): string {
    return results?.replace(/\n/g, '<br>');
  }

  updateFileStatistiques(message: any, socialReason: any, completed: boolean) {
    const now = new Date();
    const formattedDate = this.formatDate(now);
    let history = { message: message, date: formattedDate , socialReason: socialReason, status: completed ? 'passed' : 'failed' }
    this.Statistiques.filter((element: any) => element.name === this.folder.code);
    if (completed) {
      this.Statistiques.filter((element: any) => element.name === this.folder.code)[0].passed += 1
    } else {
      this.Statistiques.filter((element: any) => element.name === this.folder.code)[0].failed += 1
    }
    this.Statistiques.filter((element: any) => element.name === this.folder.code)[0].total += 1
    this.Statistiques.filter((element: any) => element.name === this.folder.code)[0].history.push(history)
    this.service.updateFileStatistiques(this.Statistiques).subscribe((data: any) => { })
  }
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}