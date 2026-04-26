import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { HousingLocation } from '../housing-location/housing-location';

// ViewModel type — extends the data model with UI state
type HousingLocationViewModel = HousingLocationInfo & { selected: boolean };

@Component({
  selector: 'app-home',
  imports: [HousingLocation, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  locationSevice: LocationService = inject(LocationService);
  router = inject(Router);

  mode = signal<'normal' | 'edit'>('normal');

  // locationsToDisplay = linkedSignal<HousingLocationInfo[], HousingLocationViewModel[]>({
  //   source: this.locationSevice.getAllLocations(),
  //   computation: (newDependencyValueHouseLocationInfoArray, prevValue) => {
  //     const prevLocationViewModels = prevValue?.value?? [];
  //     const viewLocationsModels = newDependencyValueHouseLocationInfoArray.map((hl) => {
  //       const matchedModel = prevLocationViewModels.find(
  //         (prevLocation) => prevLocation.id === hl.id, //if previously selected items are are we have to retain it
  //       );
  //       return { ...hl, selected: matchedModel?.selected };
  //     });
  //     return prevLocationViewModels;
  //   },
  // });

  locationsToDisplay = linkedSignal<HousingLocationInfo[], HousingLocationViewModel[]>({
    source: () => this.locationSevice.getAllLocations(),
    computation: (newLocations, prev) => {
      const prevModels = prev?.value ?? [];
      const viewLocationsModels = newLocations.map((hl) => {
        const matchedModel = prevModels.find((prevLocation) => prevLocation.id === hl.id);
        return { ...hl, selected: matchedModel?.selected ?? false };
      });
      return viewLocationsModels;
    },
  });
 ActivatedRoute = inject(ActivatedRoute);

  handleCheck(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.mode.update((prev) => (prev === 'normal' ? 'edit' : 'normal'));

    // Clear all selections when switching back to normal mode
    if (this.mode() === 'normal') {
      this.locationsToDisplay.update((vms) => vms.map((vm) => ({ ...vm, selected: false })));
    }
  }

  handleLocationClick(housingLocation: HousingLocationInfo) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', housingLocation.id]);
    } else {
      this.locationsToDisplay.update((vms) =>
        vms.map((vm) => (vm.id === housingLocation.id ? { ...vm, selected: !vm.selected } : vm)),
      );
    }
  }

  isSelected(id: number) {
    return this.locationsToDisplay().find((vm) => vm.id === id)?.selected ?? false;
  }

  get selectedVms() {
    return this.locationsToDisplay().filter((vm) => vm.selected);
  }

  handleDelete() {
    if (this.selectedVms.length === 0) return;
    
    const confirmed = confirm(`Are you sure you want to delete ${this.selectedVms.length} item(s)?`);
    if (!confirmed) return;
    
    const ids = this.selectedVms.map((vm) => vm.id);
    this.locationSevice.deleteSelectedLocations(ids);
    
    // Clear selections and rebuild list after deletion
    this.locationsToDisplay.set(
      this.locationSevice.getAllLocations().map((loc) => ({ ...loc, selected: false })),
    );
  }

  handleRestore() {
    const deletedIds = this.locationSevice.getDeletedItems();
    if (deletedIds.length === 0) return;
    
    this.locationSevice.restoreSelectedLocations(deletedIds);
    
    // Rebuild list after restore
    this.locationsToDisplay.set(
      this.locationSevice.getAllLocations().map((loc) => ({ ...loc, selected: false })),
    );
  }

  handleAdd() {
    // const newLocation = {
    //   id: 0,
    //   name: 'New Location',
    //   city: 'City',
    //   state: 'State',
    //   photo:
    //     'https://angular.dev/assets/images/tutorials/common/webaliser-_TPTXZd9mOo-unsplash.jpg',
    //   availableUnits: 0,
    //   wifi: false,
    //   laundry: false,
    //   selected: false,
    // };
    // this.locationSevice.addLocation(newLocation);
    this.router.navigate(['edit'],{relativeTo:this.ActivatedRoute})
  }
  handleEdit(location: HousingLocationInfo) {
  this.router.navigate(['home', 'edit', location.id]);
}

}
