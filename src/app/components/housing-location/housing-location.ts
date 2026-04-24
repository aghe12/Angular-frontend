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

  // Emits the id of the location to delete up to Home
  onDelete = output<number>();

  // Emits the full location object up to Home when Edit is clicked
  onEdit = output<HousingLocationInfo>();

  locationService = inject(LocationService);
  baseURL = inject(BASE_URL);

  handleClick(event: MouseEvent) {
    console.log(`${this.housingLocation().name} is clicked in ${this.mode()} mode`);
    this.onLocationClick.emit(this.housingLocation());
  }

  handleDelete(event: MouseEvent) {
    // Stop the click from bubbling up to the card's handleClick
    event.stopPropagation();
    this.onDelete.emit(this.housingLocation().id);
  }

  handleEdit(event: MouseEvent) {
    // Stop bubbling so card click doesn't fire alongside edit click
    event.stopPropagation();
    this.onEdit.emit(this.housingLocation());
  }
}
