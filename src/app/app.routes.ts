import { Routes } from '@angular/router';
import { Home } from '@components/home/home';
import { LocationDetails } from '@components/location-details/location-details';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title:"Home page",
  },
  {
    path: 'details/:id',
   component: LocationDetails,
   title:"Home details page",
  },
];