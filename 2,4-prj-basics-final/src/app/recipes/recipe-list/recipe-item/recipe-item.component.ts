import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipesService } from '../../recipes.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent implements OnInit {
  constructor(private recipesService: RecipesService) {}

  @Input() recipe: Recipe;
  // @Output() selectRecipe: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  ngOnInit() {}

  onRecipeSelect() {
    // this.selectRecipe.emit();
    this.recipesService.selectRecipe.emit(this.recipe);
  }
}
