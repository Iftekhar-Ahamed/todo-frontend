import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  message: string = '';
  actionMsg: string = '';
  v: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, v: boolean, actionMsg: string }
  ) {
    this.message = data.message;
    this.actionMsg = data.actionMsg;
    this.v = data.v;
  }

  close(): void {
    this.dialogRef.close();
  }
}