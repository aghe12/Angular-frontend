import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingSelection } from './shipping-selection';

describe('ShippingSelection', () => {
  let component: ShippingSelection;
  let fixture: ComponentFixture<ShippingSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
