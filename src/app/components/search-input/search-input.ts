import { Component, signal, output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  imports: [],
  templateUrl: './search-input.html',
  styleUrl: './search-input.css'
})
export class SearchInputComponent {
  searchTerm = signal<string>('');
  searchOutput = output<string>();

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.searchTerm.set(value);
    
    if (value.length >= 3) {
      this.searchOutput.emit(value.toLowerCase());
    }
  }
}
