import { Component, OnInit, ViewChild } from '@angular/core';
import { JsonEditorService } from '../../services/json-editor.service';
import { ActivatedRoute } from '@angular/router';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class CustomJsonEditorComponent implements OnInit {
  fileContent: any
  fileName: any
  folder:any
  public editorOptions: JsonEditorOptions | any;
  form:FormGroup | any;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent | any;

  constructor(private service: JsonEditorService,private route: ActivatedRoute,private fb:FormBuilder) {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.mode = 'code';
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']
    this.route.params.subscribe(params => {
      this.folder  = params['param1'];
      this.fileName  = params['param2'];
    });

  }
  ngOnInit(): void {
    this.getContentFile()
  }


  getContentFile() {
    this.service.getContentFile(this.fileName, this.folder).subscribe(data => {
      this.fileContent = JSON.stringify(data, null, 2);
      this.fileContent = JSON.parse(this.fileContent)
      this.form = this.fb.group({
        myinput: [this.fileContent]
      });
    })
  }
  saveFile() {
    let data = JSON.stringify({
      fileName: this.fileName,
      folder: this.folder,
      content: this.form.get("myinput").value ? this.form.get("myinput").value : {}
    })
    this.service.updateFile(data).subscribe(data => {
    });
  }

}
