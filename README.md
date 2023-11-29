# Course Notes

## Routing (Basics)

First, we need a routes array. As a best practice, this is often created inside its own module file, so create that.

```sh
ng generate module app-routing
```

Now inside this [file](./3-routing-start/src/app/app-routing.module.ts) (app-routing.module.ts), create a `routes` array.

- On the most basic level, this array will be an array of objects each with two properties.
- The first will be the `path` to the route
- The next will be the `component` that needs to be shown at that route.

So it will be something like:

```ts
const routes: Array<Route> = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  {
    path: "users",
    component: UsersComponent,
    children: [{ path: ":id/:name", component: UserComponent }],
  },
  {
    path: "not-found",
    component: NotFoundComponent,
  },
  { path: "**", redirectTo: "/not-found" },
];
```

Other route propterties include:

- `children` for nested routes
- `redirectTo` for redirecting a path to another path.

**Note.** The last route in the above list (\*\*) is called a _wildcard_.

**Note.** The first route can be rewritten as:

```ts
{ path: '', redirectTo: '/home', pathMatch: 'full' }
```

The `pathMatch` is needed so that it does not match every path containing '' (which is, basically, every path). By default, partial match is performed

When the routes array is ready, pass it as an import inside `NgModule` using `RouterModule.forRoot` method, and export the `RouterModule`.

```ts
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
```

Next, move over to the `AppModule` [file](./3-routing-start/src/app/app.module.ts) and add this `AppRoutingModule` insdie the `imports` array.

Finally, go to the HTML [file](./3-routing-start/src/app/app.component.html) where the routing is needed (mostly app.component.html), and put the `router-outlet` directive where the routing needs to happen.

### Passing static data

This is done using the `data` property of the route object. It holds an object which will contian the data. For example:

```ts
{
    path: 'not-found',
    component: NotFoundComponent,
    data: { message: 'Page not found.' },  // this line
},
```

This can then be retrieved in the component TS [file](./3-routing-start/src/app/not-found/not-found.component.ts) through the activated route, either via `snapshot` or observable (below).

```ts
this.activatedRoute.data.subscribe((data: Data) => {
  if (data?.message) {
    this.errorMessage = data.message;
  }
});
```

### Styling the active link

- Attribute is `routerLinkActive` and value is the CSS class name for the active route.

```html
<li role="presentation" routerLinkActive="active">
  <a routerLink="/servers">Servers</a>
</li>
```

- If we want complete matching of the route (necessary for index page with "/" as the route), we pass the `routerLinkActiveOptions` and bind it to an object with `exact` specified as `true`.

```html
<li
  role="presentation"
  routerLinkActive="active"
  [routerLinkActiveOptions]="{ exact: true }"
>
  <a routerLink="/">Home</a>
</li>
```

## Routing Services

There are 3 kinds of routing services that I know of.

### Auth Guards: Activated Guards

The first is the one that you activate. It's purpose is to block access to routes that are not activated. This can be useful when trying to block access to unauthenticated users.

To set this up, create a new service for this authguard.

```sh
ng g s auth-guard
```

This will create a service with `AuthGuardService` as the exportable class. Make it implement the `CanActivate` interface which needs to be imported from @angular/router.

```ts
export class AuthGuardService implements CanActivate {
  /* ... */
}
```

Now, this class needs to implement the `CanActivate` method. This method will contain the logic for the auth guard. If the method returns true, navigation to the guarded route will be allowed. Else, we are redirected to the home page.

```ts
canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.isAuthenticated().then((authState: boolean) => {
      if (authState) {
        return true;
      } else {
        this.router.navigate(['/']);
      }
    });
  }
```

The `route` and `state` types are imported from @angular/router.

This can also be extended to child routes by implementing the `CanActivateChild` interface. Simply call the above `canActivate` method in the `canActivateChild` method. Refer to the [file](./3-routing-start/src/app/auth-guard.service.ts) for the full code.

To use this, just add this guard as a value to the `canActivate` or `canActivateChild` property in the route object to the routes that need guarding in the routing module file, like:

```ts
{
    path: 'servers',
    component: ServersComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: ':id',
        component: ServerComponent,
      },
      {
        path: ':id/edit',
        component: EditServerComponent,
      },
    ],
},
```

### Auth Guards: Deactivated Guards

The second auth guards are the ones for deactivation. Their purpose is to stop the user from navigating away from a route unless confirmation is received. For this, first create a service to house the interface for deactivation.

```sh
ng g s can-deactivate
```

Next, create an interface in this [file](./3-routing-start/src/app/can-deactivate.service.ts) inside this service that contains the method needed for deactivation, and export it.

```ts
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
```

Implement this interface inside the service class and call the `component.canDeactivate` method in it. (Its logic will be written in another file.)

```ts
canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return component.canDeactivate();
}
```

Next, add this deactivate guard in the route that needs it in the routing module file.

```ts
{
    path: ':id/edit',
    component: EditServerComponent,
    canDeactivate: [CanDeactivateService],
},
```

Finally, inside the TS [file](./3-routing-start/src/app/servers/edit-server/edit-server.component.ts) of the component that needs this guard, implement the above exported impterface. And write the logic for deactivation inside the `canDeactivate` function (or whichever function is present in the interface).

```ts
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  /* ... */

  canDeactivate() {
    if (this.disableEdit || this.changesSaved) {
      return true;
    }

    if (
      this.serverName !== this.server.name ||
      this.serverStatus !== this.serverStatus
    ) {
      return confirm(
        "Looks like your changes are not saved. Are you sure you want to leave?"
      );
    }
  }
}
```

Essentially, the user will be allowed to leave the route when the `canDeactivate` method returns `true`.

### Resolvers

These are used to get dynamic data in the in a route object (as opposed to `data`, which was for static data).

To use this in your application, first create the resolver service.

```sh
ng g s server-resolver
```

Next, implement the `Resolve` interface imported from @angular/router, and wrap it around the type of data you want to return (either synchronously or asynchronously).Inside this class, write the logic to return the dynamic data in the `resolve` method taken from the interface.

```ts
export class ServerResolverService implements Resolve<Server> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Server | Observable<Server> | Promise<Server> {
    return this.serversService.getServer(+route.params.id);
  }
}
```

Next, put this resolver service inside an object to `resolve` property of a path object. In the inner object, this service should be the value of a key which will then be used to get the data in the component (here, that's `server`).

```ts
{
    path: ':id',
    component: ServerComponent,
    resolve: { server: ServerResolverService },
}
```

Lastly, use this data in the component TS [file](./3-routing-start/src/app/servers/server/server.component.ts) that needs it from the `data` property of the activated route object.

```ts
this.activatedRoute.data.subscribe((data) => {
  this.server = data.server;
});
```

## Routing (Interceptors)

Interceptors are services that are used to:

- intercept a request midway, modify it, then send the modified request,
- tap on the response of the request received and perform common operations based on the response.

For this, first create a service file (manually, not using CLI) for the interceptor. For example, the [file](./8-http-01-start/src/app/auth-interceptor.service.ts) auth-interceptor.service.ts. In the class of this service, implement the `HttpInterceptor` interface imported from @angular/common/http.

Inside the class, write the intercepting logic in the `intercept` method from the interface. Here, the request is getting cloned, a new header is added to the cloned request, and the cloned request is going as the request using `next.handle`.

```ts
export class AuthIntercepterService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedReq = req.clone({
      headers: req.headers.append("test", "123"),
    });
    return next.handle(modifiedReq);
  }
}
```

Next, add this service in the `providers` array of app module [file](./8-http-01-start/src/app/app.module.ts). Keep in mind to:

- add the class as a value of the `useClass` property
- provide the `HTTP_INTERCEPTOR` token which is needed for this service.

```ts
{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthIntercepterService,
    multi: true,
},
```

For tapping into the response and performing common operations, refer to this [file](./8-http-01-start/src/app/logging-interceptor.service.ts).
