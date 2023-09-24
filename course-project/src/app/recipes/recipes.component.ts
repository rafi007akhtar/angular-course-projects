import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipesService } from './recipes.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  public selectedRecipe: Recipe;

  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    this.recipesService.selectRecipe.subscribe((recipe: Recipe) => {
      this.selectedRecipe = recipe;
    });
  }

  showThisRecipe(recipe: Recipe) {
    // this.selectedRecipe = recipe;
  }
}
