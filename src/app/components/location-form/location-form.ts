import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-location-form',
  imports: [],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm {
  shouldShowPanel=signal<boolean>(false);

  ngOnInit(){
    this.showPanel();
  }
  showPanel(){
    this.shouldShowPanel.set(true);
  }

  hidePanel(){
      this.shouldShowPanel.set(false);
  }
}
