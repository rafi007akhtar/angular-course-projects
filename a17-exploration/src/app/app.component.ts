import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShowInfoComponent } from './show-info/show-info.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShowInfoComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'a17-exploration';

  name = '';

  getName() {
    this.name = 'Rafi';
  }

  ngOnInit(): void {
    this.getName();
  }
}
