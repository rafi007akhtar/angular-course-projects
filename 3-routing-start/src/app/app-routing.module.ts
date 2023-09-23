import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { ServersComponent } from './servers/servers.component';
import { UserComponent } from './users/user/user.component';
import { ServerComponent } from './servers/server/server.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EditServerComponent } from './servers/edit-server/edit-server.component';
import { AuthGuardService } from './auth-guard.service';
import { CanDeactivateService } from './can-deactivate.service';
import { ServerResolverService } from './servers/server/server-resolver.service';

const routes: Array<Route> = [
  { path: '', component: HomeComponent },
  {
    path: 'users',
    component: UsersComponent,
    children: [{ path: ':id/:name', component: UserComponent }],
  },
  {
    path: 'servers',
    component: ServersComponent,
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: ':id',
        component: ServerComponent,
        resolve: { server: ServerResolverService },
      },
      {
        path: ':id/edit',
        component: EditServerComponent,
        canDeactivate: [CanDeactivateService],
      },
    ],
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { message: 'Page not found.' },
  },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
      //  { useHash: true }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
