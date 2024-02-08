import { Component } from '@angular/core';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  todoItems: TodoItem[] = [];
  newItemText: string = '';

  addTodo() {
    if (this.newItemText.trim() !== '') {
      const newTodo: TodoItem = {
        id: Date.now(),
        text: this.newItemText,
        completed: false
      };
      this.todoItems.push(newTodo);
      this.newItemText = '';
    }
  }

  updateTodoStatus(todo: TodoItem) {
    todo.completed = !todo.completed;
  }

  deleteTodo(index: number) {
    this.todoItems.splice(index, 1);
  }
}
