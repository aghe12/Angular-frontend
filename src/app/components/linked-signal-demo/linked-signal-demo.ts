import { ChangeDetectionStrategy, Component, computed, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './linked-signal-demo.html',
  styleUrl: './linked-signal-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedSignalDemo {
  userStatus = signal<'online' | 'offline' | 'away'>('offline');

  // notificationPreference=signal<boolean>(this.userStatus()==='online');

  // Now using linkedSignal instead of computed - writable!
  notificationsEnabled = linkedSignal(() => this.userStatus() === 'online');

  statusMessage = computed(() => {
    const status = this.userStatus();
    switch (status) {
      case 'online':
        return 'Available for meetings and messages';
      case 'away':
        return 'Temporarily away, will respond soon';
      case 'offline':
        return 'Not available, check back later';
      default:
        return 'Status unknown';
    }
  });

  isWithinWorkingHours = computed(() => {
    const now = new Date();
    const hour = now.getHours();
    const isWeekday = now.getDay() > 0 && now.getDay() < 6;
    return isWeekday && hour >= 9 && hour < 17 && this.userStatus() !== 'offline';
  });

  toggleNotifications() {
    // This works with linkedSignal but would error with computed!
    this.notificationsEnabled.set(!this.notificationsEnabled());
  }

  goOnline() {
    this.userStatus.set('online');
  }

  goAway() {
    this.userStatus.set('away');
  }

  goOffline() {
    this.userStatus.set('offline');
  }

  toggleStatus() {
    const current = this.userStatus();
    switch (current) {
      case 'offline':
        this.userStatus.set('online');
        break;
      case 'online':
        this.userStatus.set('away');
        break;
      case 'away':
        this.userStatus.set('offline');
        break;
    }
  }

  toggleNotificationsIfOnline() {
    this.notificationsEnabled.update((prev) => !prev);
  }
}
