import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.scss'],
})
export class GameControlComponent implements OnInit {
  num = 0;
  interval: any;
  @Output() emitNum = new EventEmitter<number>();

  ngOnInit(): void {}

  startGame() {
    this.interval = setInterval(() => {
      this.emitNum.emit(++this.num);
    }, 1000);
  }

  stopGame() {
    clearInterval(this.interval);
  }
}
