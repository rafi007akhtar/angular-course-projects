import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingService {
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];
  ingredientsChanged = new Subject<Ingredient[]>();

  constructor() {}

  getIngredients() {
    return [...this.ingredients];
  }

  addNewIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients);
  }

  addNewIngredients(ingredientList: Ingredient[]) {
    this.ingredients = [...this.ingredients, ...ingredientList];
    this.ingredientsChanged.next(this.ingredients);
  }
}
