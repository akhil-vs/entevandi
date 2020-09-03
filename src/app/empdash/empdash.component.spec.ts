import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpdashComponent } from './empdash.component';

describe('EmpdashComponent', () => {
  let component: EmpdashComponent;
  let fixture: ComponentFixture<EmpdashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpdashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
