import { Component, inject, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // to read :id from URL
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
  onSaved = output<void>();  //submit implementation

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
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam !== null && idParam !== undefined) {
      const location = this.locationService.getLocationById(Number(idParam));
      if (location) {
        this.locationForm.patchValue(location);
      }
    }
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

    this.onSaved.emit(); //also for submit
  }
}
