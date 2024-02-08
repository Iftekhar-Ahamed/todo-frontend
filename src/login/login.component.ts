import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../app/api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../app/popup/popup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  users$: Observable<any> | undefined;
  usernameInput: string = '';
  passwordInput: string = '';

  constructor(private apiService: ApiService, private router: Router, private dialog: MatDialog) {
  }

  onSubmit() {
    const apiUrl = "/Auth/LogIn?UserName=" + this.usernameInput + "&PassWord=" + this.passwordInput;
    if (this.usernameInput.length == 0 || this.passwordInput.length == 0) {
      return;
    }
    this.apiService.logIn(apiUrl).subscribe(
      (res) => {
        console.log(res.value);
        if (res.value.message.message == "Welcome User") {
          this.router.navigate(['/home']);
        } else {

          this.openPopup(res.value.message.message);
        }
      },
      (error) => {

        this.openPopup(error);
      }
    );
  }

  openPopup(message: string): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { message },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Popup closed');
    });
  }
}
