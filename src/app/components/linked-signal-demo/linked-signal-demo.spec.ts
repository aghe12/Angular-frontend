import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedSignalDemo } from './linked-signal-demo';

describe('LinkedSignalDemo', () => {
  let component: LinkedSignalDemo;
  let fixture: ComponentFixture<LinkedSignalDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedSignalDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedSignalDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
