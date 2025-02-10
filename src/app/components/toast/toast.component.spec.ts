import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { By } from '@angular/platform-browser';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should be visible when show is true', () => {
    component.show = true;
    fixture.detectChanges();
    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement).toBeTruthy();
  });

  it('should not be visible when show is false', () => {
    component.show = false;
    fixture.detectChanges();
    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement).toBeNull();
  });

  it('should hide the toast when closeToast is called', () => {
    component.show = true;
    component.closeToast();
    expect(component.show).toBeFalse();
  });
});
