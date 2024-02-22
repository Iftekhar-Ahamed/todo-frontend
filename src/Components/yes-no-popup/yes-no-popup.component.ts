import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-yes-no-popup',
  templateUrl: './yes-no-popup.component.html',
  styleUrl: './yes-no-popup.component.css'
})
export class YesNoPopupComponent {
  message: string = '';
  twobutton: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {
    this.message = data.message;
    console.log(this.message);
  }
  onNoClick(): void {
    this.dialogRef.close('no');
  }

  onYesClick(): void {
    this.dialogRef.close('yes');
  }

  close(): void {
    this.dialogRef.close();
  }
}
