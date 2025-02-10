import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit "confirmDelete" and close the modal on confirm()', () => {
    spyOn(component.confirmDelete, 'emit');
    spyOn(component.close, 'emit');

    component.confirm();

    expect(component.confirmDelete.emit).toHaveBeenCalled();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit "close" on closeModal()', () => {
    spyOn(component.close, 'emit');

    component.closeModal();

    expect(component.close.emit).toHaveBeenCalled();
  });
});
