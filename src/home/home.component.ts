import { Component } from '@angular/core';
import { ApiService } from '../app/api.service';
import { url } from 'inspector';

interface TodoItem {
  taskId: number;
  taskName: string;
  taskDescription: string;
  expireDateTime: Date;
  creationDateTime: Date;
  priorityId: number;
  userId: number;
  status: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  todoItems: TodoItem[] = [];
  newItemText: string = '';
  newItemDate: Date = new Date();
  newItemPriority: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    const url = "/ToDo/GetAllTaskByUserId?UserId=1&OrderBy=ASC&PageNo=0&PageSize=20";
    this.apiService.getTodos(url).subscribe(
      res => {
        for (const item of res.data) {
          this.todoItems.push(item);
        }

      },
      (error) => {
        console.error('Error fetching todos:', error);
      }
    );
  }

  addTodo() {
    if (this.newItemText.trim() !== '') {
      const newTodo: TodoItem = {
        userId: 1,
        taskDescription: this.newItemText,
        taskId: Date.now(),
        taskName: this.newItemText,
        expireDateTime: this.newItemDate,
        creationDateTime: new Date(),
        priorityId: this.newItemPriority,
        status: false
      };
      this.todoItems.push(newTodo);
      this.newItemText = '';
      this.newItemDate = new Date();
    }
  }

  updateTodoStatus(todo: TodoItem) {
    todo.status = !todo.status;
  }

  deleteTodo(index: number) {
    this.todoItems.splice(index, 1);
  }
}
