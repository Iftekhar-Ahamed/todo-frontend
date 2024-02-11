import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:44360';

  constructor(private http: HttpClient) { }

  logIn(url: string): Observable<any> {
    const apiUrl = this.baseUrl + url;
    return this.http.get<any>(apiUrl);
  }
  getTodos(url: string): Observable<any> {
    const apiUrl = this.baseUrl + url;
    return this.http.get<any>(apiUrl);
  }
  getPriorityDDL(url: string): Observable<any> {
    const apiUrl = this.baseUrl + url;
    return this.http.get<any>(apiUrl);
  }
  createTask(taskPayload: any, url: string): Observable<any> {
    const apiUrl = this.baseUrl + url;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    console.log(taskPayload, apiUrl);
    return this.http.post<any>(apiUrl, taskPayload, httpOptions);
  }
}
