import {Component, OnDestroy, OnInit} from '@angular/core';
import {Task, TaskService} from "../../services/task.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TaskCardComponent} from "../task-card/task-card.component";
import {ToastComponent} from "../toast/toast.component";
import {TASK_ADDED_TOAST_MESSAGE, TASK_DELETED_TOAST_MESSAGE, TODO} from "../../shared/constants";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    TaskCardComponent,
    ToastComponent,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})

export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  taskForm: FormGroup;
  toastVisible = false;
  toastMessage = '';
  destroy$ = new Subject<void>();

  constructor(private readonly taskService: TaskService, private readonly fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      status: [TODO]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {

    this.taskService.getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.tasks = data;
        },
        error: (error) => {
          alert('Servicio no disponible ' )
          console.error('Error loading tasks:', error);
        },
      });
  }

  addTask(): void {
    if (this.taskForm.invalid) {
      this.showToast('Title is required');
      return;
    }
    this.taskService.addTask(this.taskForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
      this.loadTasks();
      this.taskForm.reset({title: '', description: '', status: TODO});
      this.showToast(TASK_ADDED_TOAST_MESSAGE);
    });
  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), 3000);
  }

  updateStatus(task: Task, status: Task['status']): void {
    this.taskService.updateTaskStatus(task.id!, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadTasks());
  }

  deleteTask(task: Task): void {
    if (task.id) {
      this.taskService.deleteTask(task.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
        this.showToast(TASK_DELETED_TOAST_MESSAGE(task.title));
        this.loadTasks();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
