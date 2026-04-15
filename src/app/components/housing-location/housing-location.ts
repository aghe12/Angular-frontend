import { Component, input, output } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';

@Component({
  selector: 'app-housing-location',
  templateUrl: './housing-location.html',
  styleUrls: ['./housing-location.css'],
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
  onLocationClick =output<HousingLocationInfo>();

  handleClick(){
    console.log(`${this.housingLocation().name} is clicked`);
    this.onLocationClick.emit(this.housingLocation());
  }
}
