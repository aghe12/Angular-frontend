import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forms',
  imports: [ReactiveFormsModule],
  templateUrl: './forms.html',
  styleUrl: './forms.css',
})
export class Forms {

  formBuilder=inject(FormBuilder);
name = new FormControl('');

  //  profileForm = new FormGroup({
  //   firstName: new FormControl(''),
  //   lastName: new FormControl(''),
  //   address: new FormGroup({
  //     street: new FormControl(''),
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     zip: new FormControl(''),

  // here we are using form builder to crate form group and form controls
  profileForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(5)]],
    lastName: [''],
    email: ['', Validators.email],
    address: this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      zip: ['']
    }),
  });

  handleChange() {
    console.log('name value: ', this.name.value);
  }

  updateName() {
    this.name.setValue('Nancy');
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
  }

  updateForm(){
    this.profileForm.patchValue({lastName:"Shetty", address:{street:"kelinja", city:"Bantwal", state:"KA", zip:"574222"}});
    // this.profileForm.setValue({firstName:""});
  }
}
