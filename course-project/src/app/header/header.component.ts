import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  userSubs: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubs = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user?.token;
    });
  }

  onSaveClick() {
    this.dataStorageService.storeRecipes();
  }

  onFetchClick() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
  }
}
