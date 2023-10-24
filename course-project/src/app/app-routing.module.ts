import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { RecipesComponent } from './recipes/recipes.component';
import { NgModule } from '@angular/core';

/* Super ultra important note:
  When lazy loading a certain module, be sure to remove it from app.module.ts
  If you don't, that would be lazy loading + eager loading at the same time
  And that will result in the page not loading, probably, depending on the routes setup
*/
const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((m) => m.RecipesModule),
  },
  {
    path: 'shopping-list',
    loadChildren: () =>
      import('./shopping-list/shopping-list.module').then(
        (m) => m.ShoppingListModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
