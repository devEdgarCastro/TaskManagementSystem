import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskService, Task } from './task.service';
import { environment } from '../../environment';
import { provideHttpClient } from '@angular/common/http';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/api/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve tasks from the API via GET', () => {
    const dummyTasks: Task[] = [
      { id: '1', title: 'Task 1', description: 'Description 1', status: 'TODO' },
      { id: '2', title: 'Task 2', description: 'Description 2', status: 'COMPLETED' }
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(dummyTasks);
    });

    const request = httpMock.expectOne(apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush(dummyTasks);
  });

  it('should add a new task via POST', () => {
    const newTask: Task = { title: 'New Task', description: 'New Description', status: 'TODO' };

    service.addTask(newTask).subscribe(task => {
      expect(task).toEqual({ ...newTask, id: '123' });
    });

    const request = httpMock.expectOne(apiUrl);
    expect(request.request.method).toBe('POST');
    request.flush({ ...newTask, id: '123' });
  });

  it('should update task status via PUT', () => {
    const taskId = '1';
    const newStatus: Task['status'] = 'IN_PROGRESS';

    service.updateTaskStatus(taskId, newStatus).subscribe(task => {
      expect(task.status).toBe(newStatus);
    });

    const request = httpMock.expectOne(`${apiUrl}/${taskId}/${newStatus}`);
    expect(request.request.method).toBe('PUT');
    request.flush({ id: taskId, title: 'Task 1', description: 'Description 1', status: newStatus });
  });

  it('should delete a task via DELETE', () => {
    const taskId = '1';

    service.deleteTask(taskId).subscribe(response => {
      expect(response).toBeNull();
    });

    const request = httpMock.expectOne(`${apiUrl}/${taskId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
