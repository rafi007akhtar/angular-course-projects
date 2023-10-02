import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipesService } from './recipes/recipes.service';
import { Recipe } from './recipes/recipe.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private BASE_URL =
    'https://ng-course-backend-49a74-default-rtdb.firebaseio.com/';
  private URL_SUFFIX = 'recipes.json';
  completeUrl = `${this.BASE_URL}/${this.URL_SUFFIX}`;

  constructor(
    private http: HttpClient,
    private recipesService: RecipesService
  ) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put(this.completeUrl, recipes)
      .subscribe((res) => console.log({ res }));
  }

  fetchRecipes() {
    return this.http.get(this.completeUrl).pipe(
      map((recipes: Recipe[]) => {
        return recipes.map((recipe: Recipe) => {
          return { ...recipe, ingredients: recipe.ingredients || [] };
        });
      }),
      tap((recipes: Recipe[]) => {
        console.log({ recipes });
        this.recipesService.setRecipes(recipes);
      })
    );
  }
}
