import { Component, OnDestroy, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesSubscription: Subscription;

  constructor(private recipeService: RecipesService) {}

  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
    this.recipesSubscription = this.recipeService.recipesChanged.subscribe(
      (recipes) => {
        this.recipes = recipes;
      }
    );
  }

  ngOnDestroy() {
    this.recipesSubscription.unsubscribe();
  }
}
