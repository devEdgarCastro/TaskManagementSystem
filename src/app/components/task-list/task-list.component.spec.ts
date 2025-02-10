import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { of, throwError } from 'rxjs';
import { Task } from '../../services/task.service';
import {COMPLETED, TODO} from "../../shared/constants";

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let taskServiceMock: any;

  const mockTasks: Task[] = [
    { id: "1", title: 'Task 1', description: 'Description 1', status: TODO },
    { id: "2", title: 'Task 2', description: 'Description 2', status: 'IN_PROGRESS' }
  ];

  beforeEach(async () => {
    taskServiceMock = {
      getTasks: jasmine.createSpy('getTasks').and.returnValue(of([])),
      addTask: jasmine.createSpy('addTask').and.returnValue(of(null)),
      updateTaskStatus: jasmine.createSpy('updateTaskStatus').and.returnValue(of(null)),
      deleteTask: jasmine.createSpy('deleteTask').and.returnValue(of(null)),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TaskListComponent],
      providers: [{ provide: TaskService, useValue: taskServiceMock }]
    }).compileComponents();

    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on initialization', () => {
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));
    component.loadTasks();
    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(mockTasks);
  });

  it('should show an alert on task load error', () => {
    spyOn(window, 'alert');
    taskServiceSpy.getTasks.and.returnValue(throwError(() => new Error('Service error')));
    component.loadTasks();
    expect(window.alert).toHaveBeenCalledWith('Servicio no disponible ');
  });

  it('should add a task when form is valid', () => {
    taskServiceSpy.addTask.and.returnValue(of({ id: "3", title: "New Task", description: "Task Description", status: TODO }));
    spyOn(component, 'loadTasks');

    component.taskForm.setValue({
      title: 'New Task',
      description: 'Task Description',
      status: TODO
    });
    component.addTask();

    expect(taskServiceSpy.addTask).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'Task Description',
      status: TODO
    });
    expect(component.loadTasks).toHaveBeenCalled();
  });

  it('should show a toast when task is added', fakeAsync(() => {
    taskServiceSpy.addTask.and.returnValue(of({ id: "3", title: "New Task", description: "Task Description", status: TODO }));

    component.taskForm.setValue({
      title: 'New Task',
      description: 'Task Description',
      status: TODO
    });
    component.addTask();

    expect(component.toastVisible).toBeTrue();
    tick(3000);
    expect(component.toastVisible).toBeFalse();
  }));

  it('should not add a task when form is invalid', () => {
    spyOn(component, 'showToast');
    component.taskForm.setValue({
      title: '',
      description: '',
      status: TODO
    });
    component.addTask();

    expect(taskServiceSpy.addTask).not.toHaveBeenCalled();
    expect(component.showToast).toHaveBeenCalledWith('Title is required');
  });

  it('should delete a task and reload the task list', () => {
    taskServiceSpy.deleteTask.and.returnValue(of(void 0));
    spyOn(component, 'loadTasks');

    component.deleteTask(mockTasks[0]);

    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith("1");
    expect(component.loadTasks).toHaveBeenCalled();
  });

  it('should update task status and reload tasks', () => {
    taskServiceSpy.updateTaskStatus.and.returnValue(of({ id: "3", title: "New Task", description: "Task Description", status: TODO }));
    spyOn(component, 'loadTasks');

    component.updateStatus(mockTasks[0], COMPLETED);

    expect(taskServiceSpy.updateTaskStatus).toHaveBeenCalledWith("1", COMPLETED);
    expect(component.loadTasks).toHaveBeenCalled();
  });

  it('should clean up subscriptions on destroy', () => {
    spyOn(component.destroy$, 'next');
    spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();

    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });
});
