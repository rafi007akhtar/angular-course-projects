import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShoppingService } from '../shopping.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput') itemName: ElementRef;
  @ViewChild('amountInput') itemAmount: ElementRef;

  constructor(private shoppingService: ShoppingService) {}

  ngOnInit() {}

  addIngredient() {
    this.shoppingService.addNewIngredient({
      name: this.itemName.nativeElement.value,
      amount: +this.itemAmount.nativeElement.value,
    });
  }
}
