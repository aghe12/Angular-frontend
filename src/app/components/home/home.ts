import { Component, inject, linkedSignal, signal, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { HousingLocation } from '../housing-location/housing-location';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { toObservable, toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardLayout } from '../card-layout/card-layout';

type HousingLocationViewModel = HousingLocationInfo & { selected: boolean };

@Component({
  selector: 'app-home',
  imports: [HousingLocation, RouterOutlet, ReactiveFormsModule, CardLayout],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  locationSevice = inject(LocationService);
  router         = inject(Router);
  ActivatedRoute = inject(ActivatedRoute);

  // ─── SEARCH: inject DestroyRef ─────────────────────────────────────────────
  // DestroyRef lets us use takeUntilDestroyed() without @Component lifecycle hooks.
  // It auto-completes the RxJS subscription when this component is destroyed,
  // preventing memory leaks.
  destroyRef = inject(DestroyRef);

  mode = signal<'normal' | 'edit'>('normal');

  // ─── SEARCH: searchQuery signal ────────────────────────────────────────────
  // Holds the current debounced, trimmed search string.
  // Starts empty → shows all locations on load.
  // Updated by the RxJS pipe in ngOnInit after debounce + filter.
  // Takes: nothing (set internally by the subscription)
  // Gives: string — the cleaned query other parts of the component can read
  searchQuery = signal<string>('');

  // ─── SEARCH: FormControl ───────────────────────────────────────────────────
  // Plain class field — no decorator needed.
  // Bound to the <input> in home.html via [formControl]="searchControl".
  // Gives us access to .valueChanges — an RxJS Observable that emits
  // on every keystroke the user makes in the search box.
  searchControl = new FormControl('');

  // ─── SEARCH: filteredLocations signal ─────────────────────────────────────
  // Combines two streams using combineLatest:
  //   Stream 1 → toObservable(locationsSignal): emits whenever locations data
  //              changes (add / delete / update) — converts Signal → Observable
  //   Stream 2 → searchControl.valueChanges: emits on every keystroke
  //              startWith('') makes it emit immediately on load (no typing needed)
  //
  // switchMap: whenever either stream emits a new value, it cancels the previous
  //            inner call and runs searchLocationsByTerm with the latest term.
  //            Takes: [locations, term] tuple
  //            Gives: HousingLocationInfo[] — the filtered result array
  //
  // toSignal: converts the final Observable back into an Angular Signal so
  //           linkedSignal below can react to it.
  //           initialValue → used on first render before any emission arrives.
  private filteredLocations = toSignal(
    combineLatest([
      toObservable(this.locationSevice.locationsSignal),  // Stream 1: data changes
      this.searchControl.valueChanges.pipe(startWith('')), // Stream 2: user typing
    ]).pipe(
      map(([locations, term]) =>
        // Discard the raw locations array from Stream 1 (service handles filtering internally)
        // Only pass the latest search term to searchLocationsByTerm
        this.locationSevice.searchLocationsByTerm(term ?? '')
      )
    ),
    { initialValue: this.locationSevice.getAllLocations() }
  );

  // Wraps filtered results in ViewModels, preserving selection state across re-renders.
  // source → filteredLocations signal (re-runs whenever search results change)
  // computation → maps each location to a ViewModel with selected:boolean
  //               looks up previous selection state so checked cards stay checked
  //               during a search rather than resetting to false
  locationsToDisplay = linkedSignal<HousingLocationInfo[], HousingLocationViewModel[]>({
    source: () => this.filteredLocations(),
    computation: (newLocations, prev) => {
      const prevModels = prev?.value ?? [];
      return newLocations.map((hl) => {
        const match = prevModels.find((p) => p.id === hl.id);
        return { ...hl, selected: match?.selected ?? false };
      });
    },
  });

  ngOnInit() {
    // ─── SEARCH: RxJS pipe on valueChanges ──────────────────────────────────
    // This pipe is responsible for updating the searchQuery signal cleanly.
    // It does NOT drive the filtering directly — filteredLocations above does that.
    // This pipe is purely for keeping searchQuery in sync for any other
    // component/template logic that might need to read the current query.
    //
    // debounceTime(500)       → waits 500ms after user stops typing before emitting
    //                           prevents a search call on every single keystroke
    // distinctUntilChanged()  → skips emission if value hasn't actually changed
    //                           e.g. user types 'a' then deletes and retypes 'a'
    // map(value.trim())       → removes leading/trailing whitespace from the query
    // filter(len 0 or >= 3)   → ignores 1 or 2 character inputs (too short to be useful)
    //                           but allows empty string through to reset/show all
    // takeUntilDestroyed()    → auto-unsubscribes when component is destroyed
    //                           takes destroyRef so it works outside constructor
    // .subscribe()            → sets the cleaned query into the searchQuery signal
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(value => (value ?? '').trim()),
      filter((value: string) => value.length === 0 || value.length >= 3),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(query => this.searchQuery.set(query));
  }

  handleCheck(event: Event) {
    this.mode.update(prev => prev === 'normal' ? 'edit' : 'normal');
    if (this.mode() === 'normal') {
      this.locationsToDisplay.update(vms => vms.map(vm => ({ ...vm, selected: false })));
    }
  }

  handleLocationClick(housingLocation: HousingLocationInfo) {
    if (this.mode() === 'normal') {
      this.router.navigate(['details', housingLocation.id]);
    } else {
      this.locationsToDisplay.update(vms =>
        vms.map(vm => vm.id === housingLocation.id ? { ...vm, selected: !vm.selected } : vm)
      );
    }
  }

  isSelected(id: number) {
    return this.locationsToDisplay().find(vm => vm.id === id)?.selected ?? false;
  }

  get selectedVms() {
    return this.locationsToDisplay().filter(vm => vm.selected);
  }

  handleDelete() {
    if (this.selectedVms.length === 0) return;
    const confirmed = confirm(`Delete ${this.selectedVms.length} item(s)?`);
    if (!confirmed) return;
    this.locationSevice.deleteSelectedLocations(this.selectedVms.map(vm => vm.id));
    this.locationsToDisplay.set(
      this.locationSevice.getAllLocations().map(loc => ({ ...loc, selected: false }))
    );
  }

  handleRestore() {
    const deletedIds = this.locationSevice.getDeletedItems();
    if (deletedIds.length === 0) return;
    this.locationSevice.restoreSelectedLocations(deletedIds);
    this.locationsToDisplay.set(
      this.locationSevice.getAllLocations().map(loc => ({ ...loc, selected: false }))
    );
  }

  handleAdd() {
    this.router.navigate(['edit'], { relativeTo: this.ActivatedRoute });
  }

  handleEdit(location: HousingLocationInfo) {
    this.router.navigate(['home', 'edit', location.id]);
  }

  handleSearch() {
    // Trigger search with current value (already handled by reactive form)
    const currentValue = this.searchControl.value || '';
    if (currentValue.length >= 3) {
      this.searchQuery.set(currentValue.trim());
    }
  }

  handleClearSearch() {
    // Clear search input and show all locations
    this.searchControl.setValue('');
    this.searchQuery.set('');
  }

  handleFormSubmit(event: Event) {
    // Prevent form submission when Enter is pressed
    event.preventDefault();
    // Trigger search with current value
    this.handleSearch();
  }
}