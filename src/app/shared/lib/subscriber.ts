import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class Subscriber implements OnDestroy {
  private subscriptions: Subscription[] = [];

  protected addSubscription(sub: Subscription) {
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
