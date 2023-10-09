import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_KEY = 'AIzaSyAuKeul_WDVkR0_XgZ6LOULZKQKpW3TE50';
  private endpointURLs = {
    SIGNUP_URL:
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',
    SIGNIN_URL:
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
  };

  user = new BehaviorSubject<User>(null);
  logoutTimer: NodeJS.Timeout;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.endpointURLs.SIGNUP_URL}${this.API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((res) => {
          this.performUserAuthentication(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userDataStr = localStorage.getItem('userData');
    if (!userDataStr) {
      return;
    }

    const userData = JSON.parse(userDataStr);
    const currentUser = new User(
      userData.email,
      userData.id,
      userData._token,
      userData._tokenExpirationDate
    );
    if (userData._tokenExpirationDate) {
      const remainingTimeForLogout =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(remainingTimeForLogout);
    }
    this.user.next(currentUser);
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.endpointURLs.SIGNIN_URL}${this.API_KEY}`,
        {
          email,
          password,
        }
      )
      .pipe(
        tap((res) => {
          debugger;
          this.performUserAuthentication(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }

  autoLogout(expiresInMS: number) {
    if (!expiresInMS) {
      return;
    }
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, expiresInMS);
  }

  logout() {
    this.user.next(null);
    this.router.navigate['/auth'];
    localStorage.removeItem('userData');
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  performUserAuthentication(
    email: string,
    id: string,
    token: string,
    expiresInMS: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresInMS * 1000);
    const currentUser = new User(email, id, token, expirationDate);
    this.autoLogout(expiresInMS);
    this.user.next(currentUser);
    localStorage.setItem('userData', JSON.stringify(currentUser));
  }
}
