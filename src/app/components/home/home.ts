import { Component, inject, linkedSignal, signal } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { HousingLocation } from '../housing-location/housing-location';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [LocationService],
})
export class Home {
  locationSevice: LocationService = inject(LocationService);
  router = inject(Router);

  mode = signal<'normal' | 'edit'>('normal');

  // Set to track which card ids are selected in edit mode
  selectedIds = new Set<number>();

  locationsDisplay=linkedSignal<HousingLocationInfo[]>(() => {
    const allLocations = this.locationSevice.getAllLocations();
    if (this.mode() === 'normal') {
      return allLocations;
    } 
  });

  handleCheck(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    console.log(`Checkbox is now: ${checkbox.checked}`);

    this.mode.update((prev) => (prev === 'normal' ? 'edit' : 'normal'));

    // Clear all selections when switching back to normal mode
    if (this.mode() === 'normal') {
      this.selectedIds.clear();
    }
  }

  handleLocationClick(housingLocation: HousingLocationInfo) {
    console.log(`${housingLocation.name} was clicked`);

    if (this.mode() === 'normal') {
      // Normal mode — navigate to details page
      // dynamic navigation in angular is done by using the router object, and calling its navigate method,
      // and passing it an array of path segments e.g. router.navigate(["details", 1])
      this.router.navigate(['details', housingLocation.id]);
    } else {
      // Edit mode — toggle selection of the clicked card
      if (this.selectedIds.has(housingLocation.id)) {
        this.selectedIds.delete(housingLocation.id);
      } else {
        this.selectedIds.add(housingLocation.id);
      }
    }
  }

  // Helper for the template to check if a card is selected
  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }
}
