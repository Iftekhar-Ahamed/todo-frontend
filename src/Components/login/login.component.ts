import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../app/api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { DataserviceService } from '../../app/dataservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  users$: Observable<any> | undefined;
  usernameInput: string = '';
  passwordInput: string = '';

  constructor(private apiService: ApiService, private router: Router, private dialog: MatDialog, private data: DataserviceService) {
  }



  onSubmit() {
    const apiUrl = "/Auth/LogIn?UserName=" + this.usernameInput + "&PassWord=" + this.passwordInput;
    if (this.usernameInput.length == 0 || this.passwordInput.length == 0) {
      return;
    }
    this.apiService.getOperation(apiUrl).subscribe(
      (res) => {
        this.data.userInfo.userId = res.value.userInfo.userId;
        this.data.userInfo.userFirstName = res.value.userInfo.firstName;
        this.data.userInfo.userSecondName = res.value.userInfo.lastName;
        this.data.userInfo.userTypeId = res.value.userInfo.userType;
        this.data.userInfo.userToken = res.value.message.token;
        this.data.setData();

        if (res.value.message.message == "Welcome User") {
          this.router.navigate(['/home']);
        } else {
          this.openPopup(res.value.message.message, true, "Try Again");
        }
      },
      (error) => {
        this.openPopup("Server Error", true, "Try Again");
      }
    );
  }

  openPopup(message: string, v: boolean, actionMsg: string): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { message, v, actionMsg },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Popup closed');
    });
  }
}
