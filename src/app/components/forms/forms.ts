import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forms',
  imports: [ReactiveFormsModule],
  templateUrl: './forms.html',
  styleUrl: './forms.css',
  
})
export class Forms {

  formBuilder = inject(FormBuilder); // inject FormBuilder to create form groups easily

 
  locationForm = this.formBuilder.group({
    name:           ['', [Validators.required, Validators.minLength(5)]], 
    city:           ['', Validators.required],                            
    state:          ['', Validators.required],                           
    photo:          ['', Validators.required],                            
    availableUnits: [0,  [Validators.required, Validators.min(0)]],       
    wifi:           [false],                                              
    laundry:        [false],                                             
  });

  onSubmit() {
    if (!this.locationForm.valid) return; // stop if any required field is missing
    console.warn(this.locationForm.value); // log the form value — replace with real logic later
  }
}