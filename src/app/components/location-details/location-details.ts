import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';

@Component({
  selector: 'app-location-details',
  imports: [],
  templateUrl: './location-details.html',
  styleUrl: './location-details.css',
})
export class LocationDetails {
  // we need to be able to read the id of the location from window location
  // for that angular can provide us the activated route, object and from it we can get the dynamic param from the url
  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  locationService: LocationService = inject(LocationService);

  housingLocationId = -1;
  location: HousingLocationInfo | undefined;
  allLocations: HousingLocationInfo[] = [];
  currentIndex = -1;

  constructor() {
    this.allLocations = this.locationService.getAllLocations();
    LocationDetails.count += 1;
    console.log('count: ', LocationDetails.count);
  }

  // computed getters — recalculate automatically whenever currentIndex changes
  get hasPrev(): boolean {
    return this.currentIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex < this.allLocations.length - 1;
  }

  goPrev() {
    if (this.hasPrev) {
      const prevLocation = this.allLocations[this.currentIndex - 1];
      this.router.navigate(['details', prevLocation.id]);
    }
  }

  goNext() {
    if (this.hasNext) {
      const nextLocation = this.allLocations[this.currentIndex + 1];
      this.router.navigate(['details', nextLocation.id]);
    }
  }

  static count = 0;

  ngOnInit() {
    // subscribe so view updates on every prev/next click without reloading component
    this.route.params.subscribe((params) => {
      this.housingLocationId = Number(params['id']);
      console.log('updated id:', this.housingLocationId);

      this.currentIndex = this.allLocations.findIndex((l) => l.id === this.housingLocationId);
      this.location = this.allLocations[this.currentIndex];
    });
  }

  ngAfterViewInit() {
    console.log('component is now rendered');
  }

  ngOnDestroy() {
    console.log('location destroyed');
    LocationDetails.count -= 1;
  }
}
