import { Injectable } from '@angular/core';
interface UserInfo {
  userId: number;
  userFirstName: string;
  userSecondName: string;
  userTypeId: number;
  userToken: string;
}
@Injectable({
  providedIn: 'root'
})
export class DataserviceService {
  userInfo: UserInfo = {
    userId: 0,
    userFirstName: "",
    userSecondName: "",
    userTypeId: 0,
    userToken: ""
  }
  private localStorageKey = 'todoAppData';
  constructor() {
    this.userInfo = this.getData();
  }
  setData(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.userInfo));
  }
  getData(): any {
    const storedData = localStorage.getItem(this.localStorageKey);
    return storedData ? JSON.parse(storedData) : null;
  }
}
