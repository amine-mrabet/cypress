import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
const BASE_PATH = environment.basePath;
@Injectable({
  providedIn: 'root'
})
export class LayoutsService {

  constructor(private http: HttpClient) { }

  getMenu(): Observable<any> {
    return this.http.get(`${BASE_PATH}/getItems`);
  }
}
