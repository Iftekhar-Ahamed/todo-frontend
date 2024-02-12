import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5184';

  constructor(private http: HttpClient) { }


  getOperation(url: string): Observable<any> {
    const apiUrl = this.baseUrl + url;
    return this.http.get<any>(apiUrl);
  }
  postOperation(taskPayload: any, url: string): Observable<any> {
    const apiUrl = this.baseUrl + url;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    console.log(taskPayload, apiUrl);
    return this.http.post<any>(apiUrl, taskPayload, httpOptions);
  }
  deleteTask(url: string): Observable<any> {
    const apiUrl = this.baseUrl + url;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<any>(apiUrl, httpOptions);
  }
}
