import { Component, inject } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { MockLocationService } from '../../services/mock-location-service';
import { HousingLocation } from '../housing-location/housing-location';

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [{ provide: LocationService, useClass: MockLocationService }],
})
export class Home {
  locationSevice: LocationService = inject(LocationService);


  handleLocationClick(housingLocation: HousingLocationInfo) {
    console.log(`${housingLocation.name} was clicked`);
 
  }
  // handleLocationClick(location: HousingLocationInfo) {
  //   console.log(`${location.name} was clicked`);
  //   const remainingLocations = this.housingLocationList.filter(
  //     (housingLocation) => housingLocation.id !== location.id,
  //   );
  //   this.housingLocationList = [location, ...remainingLocations];
  //mockInstance is created just to mock the instances and also in that instance console we will get that 10
}
