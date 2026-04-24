import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Forms } from '@components/forms/forms';

@Component({
  selector: 'app-location-form',
  imports: [Forms],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm {
  router = inject(Router);

  shouldShowPanel = signal<boolean>(false);

  // Grab the child Forms component instance so we can read its form state
  // 'formComp' matches the template variable #formComp on <app-forms>
  @ViewChild('formComp') formComponent!: Forms;

  ngOnInit() {
    this.showPanel();
  }

  showPanel() {
    this.shouldShowPanel.set(true);
  }

  closePanel() {
    this.shouldShowPanel.set(false);
    setTimeout(() => this.router.navigate(['']), 300);
  }

  confirmClosePanel() {
    // If user has typed anything, ask before closing
    if (this.formComponent?.form?.dirty) {
      const confirmed = confirm(
        'You haven’t submitted the form yet, and your changes are unsaved. Are you sure you want to close?',
      );
      if (!confirmed) return; // this function will close and panel will remain
    }
    this.closePanel();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget && !this.formComponent?.form?.dirty) {
      // this.shouldShowPanel.set(false);
      // setTimeout(() => this.router.navigate(['']), 300);
      this.closePanel();
    }
  }
}
