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
// interface payloadTodoItem {
//   taskId: number;
//   taskName: string;
//   taskDescription: string;
//   expireDateTime: Date;
//   creationDateTime: Date;
//   priorityId: number;
//   userId: number;
//   status: boolean;
// }
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

  // newtodoItem: payloadTodoItem = {
  //   taskId: 0,
  //   taskName: '',
  //   taskDescription: '',
  //   expireDateTime: new Date(),
  //   creationDateTime: new Date(),
  //   priorityId: 0,
  //   userId: 0,
  //   status: false
  // };

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
    this.getUserDDL();
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
    const url =
      "/ToDo/GetAllTaskByUserId?UserId=" +
      this.dataservice.userInfo.userId +
      (this.sortLanding.priority == "none" ? "" : "&Priority=" + this.sortLanding.priority) +
      (this.sortLanding.date !== "none" ? "&creationDate=" + this.sortLanding.date : "") +
      (this.sortLanding.status !== null && this.sortLanding.status !== undefined ? "&Status=" + this.sortLanding.status : "") +
      (this.sortLanding.searchTerm !== "" ? "&searchTerm=" + this.sortLanding.searchTerm : "") +
      "&PageNo=" +
      this.sortLanding.pageNum +
      "&PageSize=10";

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
  getUserDDL() {
    const userddl = "/ToDo/GetAllUserDDL?OrderBy=ASC";
    this.apiService.getOperation(userddl).subscribe(
      res => {
        this.userlist = [];
        for (const item of res) {
          this.userlist.push(item);
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
    this.apiService.postOperation(this.newtodoItem, "/ToDo/UpdateTaskByTaskId").subscribe(res => {
      this.refreshPage();
    });
  }
  updateTodoItem() {
    this.apiService.postOperation(this.newtodoItem, "/ToDo/UpdateTaskByTaskId").subscribe(res => {
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
    this.newtodoItem = Object.assign({}, this.todoItems[index]);
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
