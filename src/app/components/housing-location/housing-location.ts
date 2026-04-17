import { Component, inject, input, output } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { BASE_URL, LocationService } from '../../services/location-service';

@Component({
  selector: 'app-housing-location',
  templateUrl: './housing-location.html',
  styleUrls: ['./housing-location.css'],
  providers: [{ provide: BASE_URL, useValue: 'blah blah' }],
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
  onLocationClick = output<HousingLocationInfo>();

  // Receives current mode from Home — 'normal' or 'edit'
  mode = input<'normal' | 'edit'>('normal');

  // Receives whether this specific card is selected
  isSelected = input<boolean>(false);

  locationService = inject(LocationService);
  baseURL = inject(BASE_URL);

  handleClick(event: MouseEvent) {
    console.log(`${this.housingLocation().name} is clicked in ${this.mode()} mode`);
    // Always emit up to Home — Home decides what to do based on mode
    this.onLocationClick.emit(this.housingLocation());
  }
}
