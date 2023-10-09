import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipesService } from './recipes/recipes.service';
import { Recipe } from './recipes/recipe.model';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private BASE_URL =
    'https://ng-course-backend-49a74-default-rtdb.firebaseio.com/';
  private URL_SUFFIX = 'recipes.json';
  completeUrl = `${this.BASE_URL}${this.URL_SUFFIX}`;

  constructor(
    private http: HttpClient,
    private recipesService: RecipesService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put(this.completeUrl, recipes)
      .subscribe((res) => console.log({ res }));
  }

  fetchRecipes() {
    // return this.authService.user.pipe(
    //   take(1),
    //   exhaustMap((user) => {
    //     const token = user.token;
    //     return this.http.get(this.completeUrl, {
    //       params: new HttpParams().set('auth', token),
    //     });
    //   }),
    //   catchError((err) => {
    //     return [];
    //   }),
    //   map((recipes: Recipe[]) => {
    //     return recipes.map((recipe: Recipe) => {
    //       return { ...recipe, ingredients: recipe.ingredients || [] };
    //     });
    //   }),
    //   tap((recipes: Recipe[]) => {
    //     console.log({ recipes });
    //     this.recipesService.setRecipes(recipes);
    //   })
    // );

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
