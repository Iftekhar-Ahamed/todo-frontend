import { Component } from '@angular/core';
import { ApiService } from '../app/api.service';
import { DataserviceService } from '../app/dataservice.service';
import { error } from 'node:console';

interface TodoItem {
  taskId: number;
  taskName: string;
  taskDescription: string;
  expireDateTime: Date;
  creationDateTime: Date;
  priorityId: number;
  priorityName: string;
  userId: number;
  status: boolean;
}
interface UserReport {
  priorityName: string;
  completed: number;
  notCompleted: number;
}
interface payloadTodoItem {
  taskId: number;
  taskName: string;
  taskDescription: string;
  expireDateTime: Date;
  creationDateTime: Date;
  priorityId: number;
  userId: number;
  status: boolean;
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

interface sort {
  priority: string;
  date: string;
  select: boolean;
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

  newtodoItem: payloadTodoItem = {
    taskId: 0,
    taskName: '',
    taskDescription: '',
    expireDateTime: new Date(),
    creationDateTime: new Date(),
    priorityId: 0,
    userId: 0,
    status: false
  };
  sortLanding: sort = {
    priority: "none",
    date: "none",
    select: false,
    searchTerm: "",
    pageNum: 0,
    totalPossiblePage: 0
  }
  buttonLabel: string = 'Add';
  isAddButtonVisible: boolean = true;
  isEditButtonVisible: boolean = false;
  isNextButtonVisible: boolean = false;
  isPreviousButtonVisible: boolean = false;
  totalTask: number = 0;
  completedTask: number = 0;

  userName: string = this.dataservice.userInfo.userFirstName + " " + this.dataservice.userInfo.userSecondName;



  constructor(private apiService: ApiService, private dataservice: DataserviceService) { }

  ngOnInit() {
    this.refreshPage();
  }
  refreshPage() {
    this.getAllTask();
    this.getDDL();
    this.resetTodoItem();
    this.getUserReport();
  }
  getUserReport() {
    const url = "/ToDo/UserTaskReport?UserId=" + this.dataservice.userInfo.userId;
    this.apiService.getOperation(url).subscribe(
      res => {
        console.log(res);
        this.userTaskReport = [];
        this.totalTask = res.totalTask;
        this.completedTask = res.completedTask;

        for (const item of res.taskPriorityWiseReport) {

          this.userTaskReport.push(item);
        }
      },
      (error) => {
        console.error('Error fetching todos:', error);
      }
    )
  }
  getAllTask() {
    const url = "/ToDo/GetAllTaskByUserId?UserId=" + this.dataservice.userInfo.userId +
      (this.sortLanding.priority !== "none" ? ("&Priority=" + this.sortLanding.priority) : "") +
      (this.sortLanding.date !== "none" ? ("&creationDate=" + this.sortLanding.date) : "") +
      "&Status=" + (this.sortLanding.select ? "DESC" : "ASC") +
      (this.sortLanding.searchTerm !== "" ? ("&searchTerm=" + this.sortLanding.searchTerm) : "")
      + "&PageNo=" + this.sortLanding.pageNum + "&PageSize=10";
    this.sortLanding.searchTerm = "";

    this.apiService.getOperation(url).subscribe(
      res => {
        this.todoItems = [];
        this.sortLanding.totalPossiblePage = Math.ceil(res.totalCount / 10);
        this.setPevNextButtonVisibility();
        for (const item of res.data) {
          item.expireDateTime = new Date(item.expireDateTime);
          item.creationDateTime = new Date(item.creationDateTime)
          this.todoItems.push(item);

        }

      },
      (error) => {
        console.error('Error fetching todos:', error);
      }
    );
  }
  setPevNextButtonVisibility() {
    console.log(this.sortLanding.totalPossiblePage);
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

      },
      (error) => {
        console.error('Error fetching todos:', error);
      }
    );
  }

  addTodo() {
    if (this.newtodoItem.taskName.trim() !== '') {
      this.newtodoItem.userId = this.dataservice.userInfo.userId;
      this.apiService.postOperation(this.newtodoItem, "/ToDo/CreateTask").subscribe(res => {
        this.refreshPage();
      });

    }
  }

  updateTodoItemStatus(index: number) {
    const updatePayload: payloadTodoUpdateItem = {
      taskId: this.todoItems[index].taskId,
      taskName: this.todoItems[index].taskName,
      taskDescription: this.todoItems[index].taskDescription,
      expireDateTime: this.todoItems[index].expireDateTime,
      creationDateTime: this.todoItems[index].creationDateTime,
      priorityId: this.todoItems[index].priorityId,
      status: this.todoItems[index].status
    }

    this.apiService.postOperation(updatePayload, "/ToDo/UpdateTaskByTaskId").subscribe(res => {
      this.refreshPage();
    });
  }
  updateTodoItem() {
    console.log(this.newtodoItem.expireDateTime);
    const updatePayload: payloadTodoUpdateItem = {
      taskId: this.newtodoItem.taskId,
      taskName: this.newtodoItem.taskName,
      taskDescription: this.newtodoItem.taskDescription,
      expireDateTime: this.newtodoItem.expireDateTime,
      creationDateTime: this.newtodoItem.creationDateTime,
      priorityId: this.newtodoItem.priorityId,
      status: this.newtodoItem.status
    }

    this.apiService.postOperation(updatePayload, "/ToDo/UpdateTaskByTaskId").subscribe(res => {
      this.refreshPage();
    });
  }
  deleteTodoItem(index: number) {
    this.apiService.deleteTask("/ToDo/DeleteTaskByTaskId", this.todoItems[index].taskId).subscribe(res => {
      this.refreshPage();
    });
  }
  onSearchInputChange() {
    this.getAllTask();
  }
  editTodo(index: number) {
    if (!this.isEditButtonVisible) {
      this.toggleButtons();
    }
    this.newtodoItem.taskId = this.todoItems[index].taskId;
    this.newtodoItem.taskName = this.todoItems[index].taskName;
    this.newtodoItem.taskDescription = this.todoItems[index].taskDescription;
    this.newtodoItem.expireDateTime = this.todoItems[index].expireDateTime;
    this.newtodoItem.creationDateTime = this.todoItems[index].creationDateTime;
    this.newtodoItem.priorityId = this.todoItems[index].priorityId;
    this.newtodoItem.status = this.todoItems[index].status;
  }

  resetTodoItem() {
    this.newtodoItem.taskId = 0;
    this.newtodoItem.taskName = '';
    this.newtodoItem.taskDescription = '';
    this.newtodoItem.expireDateTime = new Date();
    this.newtodoItem.priorityId = 0;
    this.newtodoItem.status = false;
  }

  toggleButtons() {
    this.isAddButtonVisible = !this.isAddButtonVisible;
    this.isEditButtonVisible = !this.isEditButtonVisible;
    this.resetTodoItem();
  }
}
