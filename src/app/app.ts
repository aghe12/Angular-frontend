import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './components/home/home';

@Component({
  selector: 'app-root',
  imports: [Home],
  templateUrl: './app.html',
  //template: `<h2>hiii word</h2>`,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('property-app');
}
