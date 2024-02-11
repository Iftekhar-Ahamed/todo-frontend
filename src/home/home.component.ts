import { Component } from '@angular/core';
import { ApiService } from '../app/api.service';

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
interface payloadTodoItem {
  taskName: string;
  taskDescription: string;
  expireDateTime: Date;
  creationDateTime: Date;
  priorityId: number;
  userId: number;
  status: boolean;
}
interface priorities {
  value: number;
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  todoItems: TodoItem[] = [];
  prioritiesFromApi: priorities[] = [];
  newtodoItem: payloadTodoItem = {
    taskName: '',
    taskDescription: '',
    expireDateTime: new Date(),
    creationDateTime: new Date(),
    priorityId: 0,
    userId: 0,
    status: false
  };

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.refreshPage();
  }
  refreshPage() {
    this.getAllTask();
    this.getDDL();
  }
  getAllTask() {
    const url = "/ToDo/GetAllTaskByUserId?UserId=1&OrderBy=ASC&PageNo=0&PageSize=20";
    this.apiService.getTodos(url).subscribe(
      res => {
        this.todoItems = [];
        for (const item of res.data) {
          this.todoItems.push(item);
        }

      },
      (error) => {
        console.error('Error fetching todos:', error);
      }
    );
  }
  getDDL() {
    const urlddl = "/ToDo/GetPriorityDDL?OrderBy=DESC";
    this.apiService.getPriorityDDL(urlddl).subscribe(
      res => {
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
      console.log(this.newtodoItem);
      console.log(this.apiService.createTask(this.newtodoItem, "/ToDo/CreateTask"));
      this.refreshPage();
    }
  }

  updateTodoStatus(todo: TodoItem) {
    todo.status = !todo.status;
  }

  deleteTodo(index: number) {
    this.todoItems.splice(index, 1);
  }
  resetTodoItem() {
    this.newtodoItem.taskName = '';
    this.newtodoItem.taskDescription = '';
    this.newtodoItem.expireDateTime = new Date();
    this.newtodoItem.priorityId = 0;
    this.newtodoItem.status = false;
  }
}
