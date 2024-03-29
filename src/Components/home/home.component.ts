import { Component } from '@angular/core';
import { ApiService } from '../../app/api.service';
import { DataserviceService } from '../../app/dataservice.service';
import { log } from 'node:console';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { YesNoPopupComponent } from '../yes-no-popup/yes-no-popup.component';

interface TodoItem {
  taskId: number;
  taskName: string;
  taskDescription: string;
  expireDateTime: Date;
  creationDateTime: Date;
  priorityId: number;
  assignedId: number;
  assigned: string;
  createBy: string;
  creatorId: number;
  priorityName: string;
  userId: number;
  status: boolean;
}
interface UserReport {
  priorityName: string;
  completed: number;
  notCompleted: number;
}

interface payloadTodoUpdateItem {
  taskId: number;
  taskName: string;
  taskDescription: string;
  expireDateTime: Date;
  creationDateTime: Date;
  priorityId: number;
  status: boolean;
}
interface priorities {
  value: number;
  name: string;
}
interface assign {
  value: number;
  name: string;
}

interface sort {
  priority: string;
  date: string;
  status?: null | number;
  searchTerm: string;
  pageNum: 0;
  totalPossiblePage: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  todoItems: TodoItem[] = [];
  userTaskReport: UserReport[] = [];
  prioritiesFromApi: priorities[] = [];
  userlist: assign[] = [];


  newtodoItem: TodoItem = {
    taskId: 0,
    taskName: '',
    taskDescription: '',
    creatorId: this.dataservice.userInfo.userId,
    expireDateTime: new Date(),
    creationDateTime: new Date(),
    priorityId: 0,
    userId: 0,
    createBy: '',
    assignedId: this.dataservice.userInfo.userId,
    assigned: '',
    status: false,
    priorityName: ''
  };
  sortLanding: sort = {
    priority: "ASC",
    date: "ASC",
    status: null,
    searchTerm: "",
    pageNum: 0,
    totalPossiblePage: 0
  }
  pagelist = new Array();
  buttonLabel: string = 'Add';
  isAddButtonVisible: boolean = true;
  isEditButtonVisible: boolean = false;
  isNextButtonVisible: boolean = false;
  isPreviousButtonVisible: boolean = false;
  pageSize: number = 10;
  totalTask: number = 0;
  isPopupOpen: boolean = false;
  completedTask: number = 0;


  userName: string = this.dataservice.userInfo.userFirstName + " " + this.dataservice.userInfo.userSecondName;



  constructor(private apiService: ApiService, private dataservice: DataserviceService, private dialog: MatDialog) { }
  ngOnInit() {
    this.refreshPage();
  }
  refreshPage() {
    this.getAllTask();
    this.getDDL();
    this.getUserDDL();
    this.resetTodoItem();
    this.getUserReport();
  }
  PageReset() {
    this.sortLanding.pageNum = 0;
  }
  getUserReport() {
    const url = "/ToDo/UserTaskReport?UserId=" + this.dataservice.userInfo.userId;
    this.apiService.getOperation(url).subscribe(
      res => {
        this.userTaskReport = [];
        this.totalTask = res.totalTask;
        this.completedTask = res.completedTask;

        for (const item of res.taskPriorityWiseReport) {

          this.userTaskReport.push(item);
        }
      },
      (log) => {
        if (log.error.split(" ")[0] === "TOKEN") {
          this.tokenRefresh(log.error.split(" ")[1]);
        }
      }
    )
  }
  getAllTask() {
    const url =
      "/ToDo/GetAllTaskByUserId?UserId=" +
      this.dataservice.userInfo.userId +
      (this.sortLanding.priority == "none" ? "" : "&Priority=" + this.sortLanding.priority) +
      (this.sortLanding.date !== "none" ? "&creationDate=" + this.sortLanding.date : "") +
      (this.sortLanding.status !== null && this.sortLanding.status !== undefined ? "&Status=" + this.sortLanding.status : "") +
      ("&searchTerm=" + this.sortLanding.searchTerm) +
      "&PageNo=" +
      (this.sortLanding.pageNum) +
      "&PageSize=" + this.pageSize;
    this.sortLanding.searchTerm = "";

    this.apiService.getOperation(url).subscribe(
      res => {
        this.todoItems = [];
        this.pagelist = [];
        this.sortLanding.totalPossiblePage = Math.ceil(res.totalCount / this.pageSize);
        for (let i = 0; i < this.sortLanding.totalPossiblePage; i++) {
          this.pagelist.push(i);
        }
        this.setPevNextButtonVisibility();
        for (const item of res.data) {
          item.expireDateTime = new Date(item.expireDateTime);
          item.creationDateTime = new Date(item.creationDateTime)
          this.todoItems.push(item);
        }

      },
      (log) => {
        if (log.error.split(" ")[0] === "TOKEN") {
          this.tokenRefresh(log.error.split(" ")[1]);
        }
      }
    );
  }
  setPevNextButtonVisibility() {
    if (this.sortLanding.totalPossiblePage - 1 > this.sortLanding.pageNum) {
      this.isNextButtonVisible = true;
    } else {
      this.isNextButtonVisible = false;
    }
    if (this.sortLanding.pageNum != 0) {
      this.isPreviousButtonVisible = true;
    } else {
      this.isPreviousButtonVisible = false;
    }
  }
  next() {
    this.sortLanding.pageNum++;
    this.refreshPage();
  }
  jump() {
    this.refreshPage();
  }
  previous() {
    this.sortLanding.pageNum--;
    this.refreshPage();
  }
  getDDL() {
    const urlddl = "/ToDo/GetPriorityDDL?OrderBy=DESC";
    this.apiService.getOperation(urlddl).subscribe(
      res => {
        this.prioritiesFromApi = [];
        for (const item of res) {
          this.prioritiesFromApi.push(item);
        }
        this.newtodoItem.priorityId = 1;
      },
      (log) => {
        if (log.error.split(" ")[0] === "TOKEN") {
          this.tokenRefresh(log.error.split(" ")[1]);
        }
      }
    );
  }
  getUserDDL() {
    const userddl = "/ToDo/GetAllUserDDL?OrderBy=ASC";
    this.apiService.getOperation(userddl).subscribe(
      res => {
        this.userlist = [];
        for (const item of res) {
          this.userlist.push(item);
        }

      },
      (log) => {
        if (log.error.split(" ")[0] === "TOKEN") {
          this.tokenRefresh(log.error.split(" ")[1]);
        }
      }
    );
  }

  addTodo() {
    if (this.newtodoItem.taskName.trim() !== '') {
      this.newtodoItem.userId = this.dataservice.userInfo.userId;
      this.apiService.postOperation(this.newtodoItem, "/ToDo/CreateTask").subscribe(res => {
        this.refreshPage();
        this.openPopup(res.message, false, "OK");
      }, (log) => {
        if (log.error.split(" ")[0] === "TOKEN") {
          this.tokenRefresh(log.error.split(" ")[1]);
        }
      });

    }
  }

  updateTodoItemStatus(index: number) {

    this.apiService.postOperation(this.todoItems[index], "/ToDo/UpdateTaskByTaskId").subscribe(res => {
      this.refreshPage();
    }, (log) => {
      if (log.error.split(" ")[0] === "TOKEN") {
        this.tokenRefresh(log.error.split(" ")[1]);
      }
    });
  }
  updateTodoItem() {
    this.apiService.postOperation(this.newtodoItem, "/ToDo/UpdateTaskByTaskId").subscribe(res => {
      this.refreshPage();
      this.openPopup(res.message, false, "OK");
    }, (log) => {
      if (log.error.split(" ")[0] === "TOKEN") {
        this.tokenRefresh(log.error.split(" ")[1]);
      }
    });
  }
  deleteTodoItem(index: number) {

    this.apiService.deleteTask("/ToDo/DeleteTaskByTaskId", this.todoItems[index].taskId).subscribe(res => {
      this.refreshPage();
    }, (log) => {
      if (log.error.split(" ")[0] === "TOKEN") {
        this.tokenRefresh(log.error.split(" ")[1]);
      }
    });
  }
  onSearchInputChange() {
    this.getAllTask();
  }
  editTodo(index: number) {
    if (!this.isEditButtonVisible) {
      this.toggleButtons();
    }
    this.newtodoItem = Object.assign({}, this.todoItems[index]);
  }

  resetTodoItem() {
    this.newtodoItem.taskId = 0;
    this.newtodoItem.taskName = '';
    this.newtodoItem.taskDescription = '';
    this.newtodoItem.expireDateTime = new Date();
    this.newtodoItem.priorityId = 0;
    this.newtodoItem.status = false;
    this.newtodoItem.assignedId = this.dataservice.userInfo.userId;
  }

  toggleButtons() {
    this.isAddButtonVisible = !this.isAddButtonVisible;
    this.isEditButtonVisible = !this.isEditButtonVisible;
    this.resetTodoItem();
  }
  openPopup(message: string, v: boolean, actionMsg: string): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { message, v, actionMsg },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isPopupOpen = false;
      this.refreshPage();
    });
  }
  openPopupConfrimation(i: number): void {
    const dialogRef = this.dialog.open(YesNoPopupComponent, {
      data: { "Do you want to delete": String },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.deleteTodoItem(i);
      }
    });
  }
  tokenRefresh(token: string) {
    var user = this.dataservice.getData();
    this.dataservice.userInfo = user;
    this.dataservice.userInfo.userToken = token;
    this.dataservice.setData();
    if (this.isPopupOpen === false) {
      this.isPopupOpen = true;
      this.openPopup("Tocken Changed", true, "Reload again");
    }

  }
}
