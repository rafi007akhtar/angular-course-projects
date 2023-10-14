import {
  Component,
  // ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  authObs: Observable<AuthResponseData>;
  authSubs: Subscription;
  alertSubs: Subscription;
  isLoginMode = true;
  isLoading = false;
  error = '';

  errorMessages = {
    // sign up error messages
    EMAIL_EXISTS: 'The email address is already in use by another account.',
    OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
    TOO_MANY_ATTEMPTS_TRY_LATER:
      'We have blocked all requests from this device due to unusual activity. Try again later.',

    // sign in error messages
    EMAIL_NOT_FOUND:
      'There is no user record corresponding to this identifier. The user may have been deleted.',
    INVALID_PASSWORD:
      'The password is invalid or the user does not have a password.',
    USER_DISABLED: 'The user account has been disabled by an administrator.',
    INVALID_LOGIN_CREDENTIALS: 'Incorrect username or password.',
    'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.':
      'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
  };

  constructor(
    private authService: AuthService,
    private router: Router // private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const { email, password } = form.value;
    this.isLoading = true;
    this.error = '';

    if (this.isLoginMode) {
      this.authObs = this.authService.login(email, password);
    } else {
      this.authObs = this.authService.signup(email, password);
    }

    this.authSubs = this.authObs.subscribe({
      next: (res) => {
        console.log('Success with response:', res);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (err) => {
        console.log('Error with response:', err);
        this.isLoading = false;

        // In the course, the error logic was handled as a pipe in the service
        // I'm keeping it here in case I'll need more from the full error object, and not just the message
        this.error = 'An error has occured.';
        const errorMessage = err?.error?.error?.message;
        if (errorMessage in this.errorMessages) {
          this.error = this.errorMessages[errorMessage];

          // using view container ref to render component dynamically
          const alertRef = this.alertHost.viewContainerRef;
          alertRef.clear();
          const alertCmp = alertRef.createComponent(AlertComponent);
          alertCmp.instance.message = this.error;
          this.alertSubs = alertCmp.instance.closeModal.subscribe(() => {
            this.resetError();
            alertRef.clear();
            this.alertSubs.unsubscribe();
          });
        }
      },
    });

    form.reset();
  }

  resetError() {
    this.error = '';
  }

  ngOnDestroy() {
    this.authSubs?.unsubscribe();
    this.alertSubs?.unsubscribe();
  }
}
