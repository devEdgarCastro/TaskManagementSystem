import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  standalone: true,
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  confirm() {
    this.confirmDelete.emit();
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}
