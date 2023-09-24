import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
// import { filter } from 'rxjs-compat/operator/filter';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  constructor() {}

  ngOnInit() {
    // const customCountObs = Observable.create((observer) => {})  // DEPRECATED
    const customCountObs: Observable<number> = new Observable(
      (observer: Subscriber<any>) => {
        let count = 0;
        setInterval(() => {
          observer.next(count);
          if (count > 2) {
            observer.complete();
          }
          if (count > 3) {
            observer.error(new Error('Count is more than 3. Oh no!'));
          }
          count++;
        }, 1000);
      }
    );

    this.subscription = customCountObs
      .pipe(
        filter((data: number) => {
          return data > 0;
        }),
        map((data) => `Round: ${data + 1}`)
      )
      .subscribe(
        (val) => {
          console.log({ val });
        },
        (err) => {
          console.log({ err });
          alert(err.message);
        },
        () => {
          console.log('Observable exceeded 2 and completed');
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
