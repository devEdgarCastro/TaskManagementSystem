import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../services/task.service';
import { NgIf } from '@angular/common';
import {ModalComponent} from "../modal/modal.component";
import {COMPLETED, IN_PROGRESS, TODO} from "../../shared/constants";
@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [NgIf, ModalComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() statusChange = new EventEmitter<Task['status']>();
  @Output() deleteTask = new EventEmitter<void>();

  protected readonly TODO = TODO;
  protected readonly IN_PROGRESS = IN_PROGRESS;
  protected readonly COMPLETED = COMPLETED;

  showModal = false;

  getStatusText(status: string): string {
    switch (status) {
      case COMPLETED:
        return 'Completada';
      case IN_PROGRESS:
        return 'En progreso';
      case TODO:
        return 'Por hacer';
      default:
        return '';
    }
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case COMPLETED:
        return 'bg-success';
      case IN_PROGRESS:
        return 'bg-info';
      case TODO:
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  confirmDeleteTask(): void {
    this.showModal = true;
  }

  onDeleteConfirmed(): void {
    this.deleteTask.emit();
    this.showModal = false;
  }

}
