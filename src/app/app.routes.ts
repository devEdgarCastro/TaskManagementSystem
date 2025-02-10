import { Routes } from '@angular/router';
import {TaskListComponent} from "./components/task-list/task-list.component";

export const routes: Routes = [
  { path: 'task-list', component: TaskListComponent },
  { path: '', redirectTo: '/task-list', pathMatch: 'full' },
  { path: '**', redirectTo: '/task-list' }
];
