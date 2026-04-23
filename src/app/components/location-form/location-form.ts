import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Forms } from '@components/forms/forms';

@Component({
  selector: 'app-location-form',
  imports: [Forms],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm {

  router =inject(Router);

  shouldShowPanel=signal<boolean>(false);
  

  ngOnInit(){
    this.showPanel();
  }
  showPanel(){
    this.shouldShowPanel.set(true);
  }

  hidePanel(){
      this.shouldShowPanel.set(false);
      setTimeout(()=>{
        this.router.navigate([''])
      },300)
  }

}
