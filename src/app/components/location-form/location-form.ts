import { Component, ElementRef, HostListener, inject, OnInit, AfterViewInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Forms } from '@components/forms/forms';
import { CdkTrapFocus } from '@angular/cdk/a11y';


@Component({
  selector: 'app-location-form',
  imports: [Forms, CdkTrapFocus],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm implements OnInit, AfterViewInit {
  router = inject(Router);
  shouldShowPanel = signal<boolean>(false);

  @ViewChild('formComp') formComponent!: Forms;
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  ngOnInit() {
    this.showPanel();
    // Tab trapping is handled by cdkTrapFocus directive in template
    // This ensures accessibility by keeping focus within the panel
    // Focus will be set to close button after panel is shown
  }

  ngAfterViewInit() {
    // Set focus to close button when panel opens for proper tab trapping
    if (this.closeBtn && this.shouldShowPanel()) {
      setTimeout(() => {
        this.closeBtn.nativeElement.focus();
      }, 100); // Small delay to ensure panel is visible
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
      // this.shouldShowPanel.set(false);
      // setTimeout(() => this.router.navigate(['']), 300);
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
