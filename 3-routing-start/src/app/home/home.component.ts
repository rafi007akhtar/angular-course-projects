import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  navigateToServers(id: number) {
    this.router.navigate(['/servers', id], {
      queryParams: { allowEdit: true },
      fragment: 'loading',
    });
  }

  changeLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.authService.login();
    } else {
      this.authService.logout();
    }
  }
}
