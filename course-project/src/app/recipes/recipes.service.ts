import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'A Test Recipe',
  //     'This is simply a test',
  //     'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
  //     [
  //       new Ingredient('first hypothetical ingredient 1', 1),
  //       new Ingredient('first hypothetical ingredient 2', 1),
  //     ]
  //   ),
  //   new Recipe(
  //     'A Test Recipe 2',
  //     'This is simply a test',
  //     'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
  //     [new Ingredient('second hypothetical ingredient', 1)]
  //   ),
  // ];

  private recipes: Array<Recipe> = [];

  recipesChanged = new Subject<Recipe[]>();

  getRecipeIndex(recipe: Recipe) {
    return this.recipes.indexOf(recipe);
  }

  getRecipeFromIndex(index: number) {
    return this.recipes[index];
  }

  constructor() {}

  getRecipes() {
    return [...this.recipes];
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next([...this.recipes]);
  }

  addNewRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next([...this.recipes]);
  }

  updateExistingRecipe(existingRecipeId: number, updatedRecipe: Recipe) {
    this.recipes[existingRecipeId] = updatedRecipe;
    this.recipesChanged.next([...this.recipes]);
  }

  deleteRecipe(recipeInd: number) {
    this.recipes.splice(recipeInd, 1);
    this.recipesChanged.next([...this.recipes]);
  }
}
