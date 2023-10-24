import { Route } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { AuthComponent } from './auth/auth.component';

export const routes: Route[] = [
  //   { path: '', redirectTo: 'recipes', pathMatch: 'full' },
  { path: '', component: RecipesComponent },
];
