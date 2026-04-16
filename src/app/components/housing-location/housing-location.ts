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
  locationService = inject(LocationService);
  baseURL = inject(BASE_URL);

  handleClick(event: MouseEvent) {
    console.log(`${this.housingLocation().name} is clicked`);
    this.onLocationClick.emit(this.housingLocation());
    console.log(`The base URL is: ${this.baseURL}`);
  }
}
