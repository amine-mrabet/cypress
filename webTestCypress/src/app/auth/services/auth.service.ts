import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
const BASE_PATH = environment.basePath;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient,private cookieService: CookieService) { }

  login(username: string, password: string): Observable<any> {
    return this.http.get(`${BASE_PATH}/login?username=${username}&password=${password}`);
  }
  logout(){
    this.cookieService.delete('token');
  }
  getToken(): string {
    return this.cookieService.get('token') ? this.cookieService.get('token') : '';
  }
  getName(){
    const decodedToken = this.decodeToken();
    return decodedToken != null ? decodedToken.username  : []; 
  }
  setToken(token: string): void {
    this.cookieService.set('token', token);
  }
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token!=null ? true : false;
  }

  decodeToken(): any {
    const token = this.getToken();
    return token!=null ? jwtDecode(token) : null;
  }
  getRoles(){
    const decodedToken = this.decodeToken();
    return decodedToken != null ? decodedToken.roles  : []; 
  }
  isTokenExpired(): boolean {

    const decodedToken = this.decodeToken();
    const currentTime = Date.now() / 1000;
    return decodedToken != null ? decodedToken.exp < currentTime : false;
  }
}
