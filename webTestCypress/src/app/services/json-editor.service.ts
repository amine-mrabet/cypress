import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from '@env/environment'
const BASE_PATH = environment.basePath

@Injectable({
  providedIn: 'root'
})
export class JsonEditorService {

  constructor(private http: HttpClient) { }
  getFolders(): Observable<any> {
    return this.http.get<any>(`${BASE_PATH}/getFolders`)
  }
  getListFilesName(folder?:any): Observable<any> {
    let params = new HttpParams();
    if (folder !== undefined && folder !== null) {
      params = params.append('folder', folder.toString());
    }
    return this.http.get<any>(`${BASE_PATH}/listFiles`, { params: params })
  }
  getContentFile(fileName?: string,folder?:any): Observable<any> {
    let params = new HttpParams();
    if (fileName !== undefined && fileName !== null) {
      params = params.append('fileName', fileName.toString());
    }
    if (folder !== undefined && folder !== null) {
      params = params.append('folder', folder.toString());
    }
    return this.http.get<any>(`${BASE_PATH}/getContentFile`, { params: params });
  }
  updateFile(body?: any): Observable<any[]> {

    let params = new HttpParams();

    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    return this.http.post<any[]>(`${BASE_PATH}/updateFile`, body, { params: params, headers: headers });
  }
  runCypress(folder?:any): Observable<any> {
    let params = new HttpParams();
    if (folder !== undefined && folder !== null) {
      params = params.append('folder', folder.toString());
    }
    return this.http.get<any>(`${BASE_PATH}/runcypress`, { params: params })
  }
  getVideos(folder?:any) {
    let params = new HttpParams();
    if (folder !== undefined && folder !== null) {
      params = params.append('folder', folder.toString());
    }
    return this.http.get(`${BASE_PATH}/getVideo`, { responseType: 'blob' ,params: params})
  }
}
