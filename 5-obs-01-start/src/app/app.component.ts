import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from './user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  isActive = false;
  activationSubscription: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.activationSubscription = this.userService.activatedEmitter.subscribe(
      (val) => {
        this.isActive = val;
      }
    );
  }

  ngOnDestroy() {
    this.activationSubscription.unsubscribe();
  }
}
