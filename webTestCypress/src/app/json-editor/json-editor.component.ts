import { Component, OnInit } from '@angular/core';
import { JsonEditorService } from '../services/json-editor.service';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnInit {
  listFileName: any
  fileContent: any
  fileName: any
  Folders: any
  items: MenuItem[] | undefined = [];
  constructor(private service: JsonEditorService) {

  }
  ngOnInit(): void {
    this.getFolders()
  }

  getFolders() {
    this.service.getFolders().subscribe(data => {
      data.forEach((element: any) => {
        this.items?.push({
          label: element,
          icon: 'fa-solid fa-folder-open',
        })
      });
    })
  }
  getListFilesName(folder: any) {
    this.service.getListFilesName(folder).subscribe(data => {
      this.listFileName = data
    })
  }
  getContentFile(fileName: string, folder: any) {
    this.fileName = fileName
    this.service.getContentFile(fileName, folder).subscribe(data => {
      this.fileContent = JSON.stringify(data, null, 2);
    })
  }
  saveFile(fileContent: any) {
    let data = JSON.stringify({
      fileName: this.fileName,
      content: fileContent ? JSON.parse(fileContent) : {}
    })
    this.service.updateFile(data).subscribe(data => {
      console.log(data)
    });
  }
  runCypress() {
    this.service.runCypress().subscribe(data => {
    })
  }
}
