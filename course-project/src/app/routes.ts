import { Route } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipesResolverService } from './recipes-resolver.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuardService } from './auth/auth-guard.service';

export const routes: Route[] = [
  //   { path: '', redirectTo: 'recipes', pathMatch: 'full' },
  { path: '', component: RecipesComponent },
  {
    path: 'recipes',
    component: RecipesComponent,
    resolve: [RecipesResolverService],
    canActivate: [AuthGuardService],
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      { path: ':id', component: RecipeDetailComponent },
      { path: ':id/edit', component: RecipeEditComponent },
    ],
  },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'auth', component: AuthComponent },
];
