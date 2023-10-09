import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  authObs: Observable<AuthResponseData>;
  authSubs: Subscription;
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
  };

  constructor(private authService: AuthService, private router: Router) {}

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
        }
      },
    });

    form.reset();
  }

  ngOnDestroy() {
    this.authSubs?.unsubscribe();
  }
}
