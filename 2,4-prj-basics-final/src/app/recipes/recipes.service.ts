import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [
        new Ingredient('first hypothetical ingredient 1', 1),
        new Ingredient('first hypothetical ingredient 2', 1),
      ]
    ),
    new Recipe(
      'A Test Recipe 2',
      'This is simply a test',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [new Ingredient('second hypothetical ingredient', 1)]
    ),
  ];

  selectRecipe = new EventEmitter<Recipe>();

  constructor() {}

  getRecipes() {
    return [...this.recipes];
  }
}
