import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingService {
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];
  ingredientsChanged = new EventEmitter<Ingredient[]>();

  constructor() {}

  getIngredients() {
    return [...this.ingredients];
    // return this.ingredients;
  }

  addNewIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    // ingredientList.push(ingredient);
    this.ingredientsChanged.emit(this.ingredients);
  }

  addNewIngredients(ingredientList: Ingredient[]) {
    this.ingredients = [...this.ingredients, ...ingredientList];
    this.ingredientsChanged.emit(this.ingredients);
  }
}
