import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Forms } from '@components/forms/forms';


@Component({
  selector: 'app-location-form',
  imports: [Forms, CdkTrapFocus],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
  // host:{`(document:keydown.escape)`:`handleEscape()`},
})
export class LocationForm   {
  router = inject(Router);
  shouldShowPanel = signal<boolean>(false);

  @ViewChild('formComp') formComponent!: Forms;
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  ngOnInit() {
    this.showPanel();
  }

  ngAfterViewInit() {
    // Set focus to close button when panel opens for proper tab trapping
    if (this.closeBtn && this.shouldShowPanel()) {
      setTimeout(() => {
        this.closeBtn.nativeElement.focus();
      }, 100); 
    }
  }

  showPanel() {
    this.shouldShowPanel.set(true);
    document.body.style.overflow = 'hidden'; //disables the background scroll
  }

  closePanel() {
    this.shouldShowPanel.set(false);
    document.body.style.overflow = ''; // restore background scroll
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
      this.closePanel();
    }
  }
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (!this.formComponent?.form?.dirty) {
      this.closePanel();
    }
  }
}
