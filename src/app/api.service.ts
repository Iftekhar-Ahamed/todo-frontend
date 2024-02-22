import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataserviceService } from './dataservice.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:44360';

  constructor(private http: HttpClient, private data: DataserviceService) { }


  getOperation(url: string): Observable<any> {
    const apiUrl = this.baseUrl + url;
    return this.http.get<any>(apiUrl, this.getRequestOptions());
  }
  postOperation(taskPayload: any, url: string): Observable<any> {
    const apiUrl = this.baseUrl + url;
    return this.http.post<any>(apiUrl, taskPayload, this.getRequestOptions());
  }
  deleteTask(url: string, taskPayload: any): Observable<any> {
    const apiUrl = this.baseUrl + url;
    return this.http.post<any>(apiUrl, taskPayload, this.getRequestOptions());
  }
  private getRequestOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.data.userInfo.userToken
    });
    return { headers: headers };
  }
}
