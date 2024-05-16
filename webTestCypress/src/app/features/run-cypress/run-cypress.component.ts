import { Component, OnInit } from '@angular/core';
import { JsonEditorService } from '@app/services/json-editor.service';

@Component({
  selector: 'app-run-cypress',
  templateUrl: './run-cypress.component.html',
  styleUrls: ['./run-cypress.component.scss']
})
export class RunCypressComponent implements OnInit{
  folders:any[] = []
  folder:any
  showVideo:boolean = false
  constructor(private service: JsonEditorService) {

  }
  ngOnInit(): void {
    this.getFolders()
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

    },(error=>{

    }),()=>{

    })
  }

  videoUrl: string = '';
  fetchVideo() {
    this.service.getVideos(this.folder.code)
      .subscribe((response: Blob) => {
        const blob = new Blob([response], { type: 'video/mp4' });
        this.videoUrl = URL.createObjectURL(blob);
        this.showVideo = true;
      });
  }
}
