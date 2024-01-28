import { Component, Input, OnInit } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-show-info',
  standalone: true,
  imports: [NgIf, NgStyle],
  templateUrl: './show-info.component.html',
  styleUrl: './show-info.component.scss',
})
export class ShowInfoComponent {
  @Input() name: string = '';
  @Input() backgroundColor = 'red';
}
