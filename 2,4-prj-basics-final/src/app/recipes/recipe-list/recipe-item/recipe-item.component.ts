import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipesService } from '../../recipes.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent implements OnInit {
  constructor(
    private recipesService: RecipesService,
    private route: ActivatedRoute
  ) {}

  @Input() recipe: Recipe;
  @Input() recipeInd: number;

  ngOnInit() {
    if (!this.recipe) {
      this.recipe = this.recipesService.getRecipeFromIndex(this.recipeInd);
    } else {
      this.recipeInd = this.recipesService.getRecipeIndex(this.recipe);
    }
  }
}
