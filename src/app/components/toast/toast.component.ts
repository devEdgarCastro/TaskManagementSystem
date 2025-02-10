import { Component, Input } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  standalone: true,
  imports: [
    NgIf
  ],
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  @Input() message: string = '';
  show: boolean = true;

  closeToast() {
    this.show = false;
  }
}
