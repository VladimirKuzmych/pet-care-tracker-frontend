import { Directive, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { auditTime, filter } from 'rxjs/operators';

@Directive({
  selector: '[appScrollTracker]',
  standalone: true
})
export class ScrollTrackerDirective implements OnInit, OnDestroy {
  @Output() scrolledToBottom = new EventEmitter<void>();
  private scrollSubscription?: Subscription;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.scrollSubscription = fromEvent(window, 'scroll')
        .pipe(
          auditTime(200),
          filter(() => (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10)
        )
        .subscribe(() => {
          this.ngZone.run(() => {
            this.scrolledToBottom.emit();
          });
        });
    });
  }

  ngOnDestroy(): void {
    this.scrollSubscription?.unsubscribe();
  }
}
