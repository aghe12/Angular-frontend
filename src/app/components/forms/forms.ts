import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';           // to read :id from URL
import { LocationService } from '../../services/location-service';

@Component({
  selector: 'app-forms',
  imports: [ReactiveFormsModule],
  templateUrl: './forms.html',
  styleUrl: './forms.css',
})
export class Forms implements OnInit {
  formBuilder = inject(FormBuilder);
  locationService = inject(LocationService);
  route = inject(ActivatedRoute);  // reads the current URL params

  locationForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', Validators.required],
    state: ['', Validators.required],
    photo: ['', Validators.required],
    availableUnits: [0, [Validators.required, Validators.min(0)]],
    wifi: [false],
    laundry: [false],
  });

  get form() {
    return this.locationForm;
  }

  ngOnInit() {
    /**
     * FORM POPULATION LOGIC - How current location data appears in the form
     * 
     * When user clicks edit icon → URL becomes /home/edit/:id (e.g., /home/edit/3)
     * Forms component reads the location ID from the current route parameter
     * Then fetches the location data and populates all form fields
     */
    
    // Step 1: Read location ID from current route URL parameter
    // URL pattern: /home/edit/:id where :id is the location ID to edit
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam !== null && idParam !== undefined) {
 
      const location = this.locationService.getLocationById(Number(idParam));

      if (location) {
        // Step 4: POPULATE FORM - Fill all form fields with current location data
        // This makes the existing values appear in the form by default
        this.locationForm.patchValue(location);
        
        // Step 5: Mark form as pristine so "unsaved changes" dialog doesn't show immediately
        // User hasn't made any changes yet, just viewing current data
        this.locationForm.markAsPristine();
      }
    }
    // If no :id in URL → ADD MODE → Form stays empty for creating new location
  }

  onSubmit() {
    if (!this.locationForm.valid) return;

    const formValue = this.locationForm.value;
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      // EDIT mode — update the existing record
      this.locationService.updateLocation({
        id: Number(idParam),
        name: formValue.name!,
        city: formValue.city!,
        state: formValue.state!,
        photo: formValue.photo!,
        availableUnits: formValue.availableUnits!,
        wifi: formValue.wifi ?? false,
        laundry: formValue.laundry ?? false,
      });
    } else {
      // ADD mode — create a new location
      this.locationService.addLocation({
        id: 0,
        name: formValue.name!,
        city: formValue.city!,
        state: formValue.state!,
        photo: formValue.photo!,
        availableUnits: formValue.availableUnits!,
        wifi: formValue.wifi ?? false,
        laundry: formValue.laundry ?? false,
      });
    }

    this.locationForm.markAsPristine();
  }
}
