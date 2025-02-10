import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { COMPLETED, IN_PROGRESS, TODO } from '../../shared/constants';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    component.task = { id: "1", title: 'Test Task', description: '', status: TODO };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit statusChange with the correct status', () => {
    spyOn(component.statusChange, 'emit');
    component.statusChange.emit(IN_PROGRESS);
    expect(component.statusChange.emit).toHaveBeenCalledWith(IN_PROGRESS);
  });

  it('should emit deleteTask when onDeleteConfirmed is called', () => {
    spyOn(component.deleteTask, 'emit');
    component.onDeleteConfirmed();
    expect(component.deleteTask.emit).toHaveBeenCalled();
  });

  it('should return correct status text for COMPLETED', () => {
    expect(component.getStatusText(COMPLETED)).toBe('Completada');
  });

  it('should return correct status text for IN_PROGRESS', () => {
    expect(component.getStatusText(IN_PROGRESS)).toBe('En progreso');
  });

  it('should return correct status text for TODO', () => {
    expect(component.getStatusText(TODO)).toBe('Por hacer');
  });

  it('should return correct status text for unknown status', () => {
    expect(component.getStatusText('UNKNOWN')).toBe('');
  });

  it('should return correct badge class for COMPLETED', () => {
    expect(component.getBadgeClass(COMPLETED)).toBe('bg-success');
  });

  it('should return correct badge class for IN_PROGRESS', () => {
    expect(component.getBadgeClass(IN_PROGRESS)).toBe('bg-info');
  });

  it('should return correct badge class for TODO', () => {
    expect(component.getBadgeClass(TODO)).toBe('bg-warning');
  });

  it('should return default badge class for unknown status', () => {
    expect(component.getBadgeClass('UNKNOWN')).toBe('bg-secondary');
  });

  it('should set showModal to true when confirmDeleteTask is called', () => {
    component.confirmDeleteTask();
    expect(component.showModal).toBeTrue();
  });

  it('should set showModal to false when onDeleteConfirmed is called', () => {
    component.showModal = true;
    component.onDeleteConfirmed();
    expect(component.showModal).toBeFalse();
  });
});
