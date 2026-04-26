import { Routes } from '@angular/router';
import { Forms } from '@components/forms/forms';
import { Home } from '@components/home/home';
import { LinkedSignalDemo } from '@components/linked-signal-demo/linked-signal-demo';
import { LocationForm } from '@components/location-form/location-form';
 
export const routes: Routes = [
   {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home,
    title: 'Home page',
    children:[{
      path:'edit',
      component:LocationForm,
      title:'Edit Location'
    },
  { path: 'edit/:id', component: LocationForm, title: 'Edit Location' },]
  },
 
  {
    path: 'details/:id',
    //component: LocationDetails,
    loadComponent: () => import('./components/location-details/location-details').then(m => m.LocationDetails),
    title: 'Home details',
  },
  {
    path: 'linked-signal',
    component: LinkedSignalDemo,
    // loadComponent: () => import('./components/linked-signal-demo/linked-signal-demo').then(m => m.LinkedSignalDemo),
    title: 'Linked Signal Demo',
  },
  {
    path: 'forms',
    component: Forms,
    // loadComponent: () => import('./components/forms/forms').then(m => m.Forms),
    title: 'Forms Experiment',
  },
];
export default routes;
