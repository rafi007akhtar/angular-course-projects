import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ShoppingService } from '../shopping.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') shoppingForm: NgForm;
  editingSubscription: Subscription;
  editMode = false;
  editedItemIndex: number;

  constructor(private shoppingService: ShoppingService) {}

  ngOnInit() {
    this.editingSubscription = this.shoppingService.editingStarted.subscribe(
      (ind: number) => {
        const ingredient = this.shoppingService.getIngredient(ind);
        this.editMode = true;
        this.editedItemIndex = ind;
        this.shoppingForm.setValue({
          name: ingredient.name,
          amount: ingredient.amount,
        });
      }
    );
  }

  onSubmit() {
    const values = this.shoppingForm.value;
    const newIngredient = {
      name: values.name,
      amount: +values.amount,
    };
    this.editMode
      ? this.shoppingService.updateExistingIngredient(
          this.editedItemIndex,
          newIngredient
        )
      : this.shoppingService.addNewIngredient(newIngredient);
    this.resetForm();
  }

  resetForm() {
    this.shoppingForm.reset();
    this.editMode = false;
  }

  onDelete() {
    if (this.editMode) {
      this.shoppingService.deleteIngredient(this.editedItemIndex);
      this.resetForm();
    }
  }

  ngOnDestroy() {
    this.editingSubscription.unsubscribe();
  }
}
