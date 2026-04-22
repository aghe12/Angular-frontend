import { Component, linkedSignal, signal } from '@angular/core';

interface ShippingMethod {
  id: number;
  name: string;
}

@Component({
  selector: 'app-shipping-selection',
  imports: [],
  templateUrl: './shipping-selection.html',
  styleUrl: './shipping-selection.css',
})
export class ShippingSelection {
  shippingOptions = signal<string[]>(['Ground', 'Air', 'Sea']);

  // userSelectedShippingOptions = linkedSignal(() => this.shippingOptions()[0]);

  userSelectedShippingOptions = linkedSignal<string[], string>({
    source: this.shippingOptions,
    computation: (newDependencyValues, myPreviousValue): string => {
      if (newDependencyValues.includes(myPreviousValue?.value as string)) {
        return myPreviousValue?.value ?? '';
      } else {
        return newDependencyValues[0];
      }
    },
  });

  changeShippingOptions() {
    this.shippingOptions.set(['Email', 'Air', 'Sea']);
  }

  handleUserInput(event: Event) {
    const userSelectedValue = (event.target as HTMLInputElement).value;
    console.log(userSelectedValue);
    this.userSelectedShippingOptions.set(userSelectedValue);
  }
}
