import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ShoppingService } from 'src/app/shopping-list/shopping.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  recipeInd = 0;

  constructor(
    private recipesService: RecipesService,
    private shoppingService: ShoppingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.recipeInd = +params.ind;
      this.recipe = this.recipesService.getRecipeFromIndex(this.recipeInd);
    });

    if (!this.recipe) {
      this.route.params.subscribe((params: Params) => {
        this.recipeInd = +params.id;
        this.recipe = this.recipesService.getRecipeFromIndex(this.recipeInd);
      });
    }
  }

  addToShoppingList() {
    console.log(this.recipe);
    this.shoppingService.addNewIngredients(this.recipe.ingredients);
  }

  onDeleteRecipe() {
    this.recipesService.deleteRecipe(this.recipeInd);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
