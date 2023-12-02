# Course Notes

Skip to:

- [Routing (Basics)](#routing-basics)
- [Routing Services](#routing-services)
  - [Auth Guards: Activated Guards](#auth-guards-activated-guards)
  - [Auth Guards: Deactivated Guards](#auth-guards-deactivated-guards)
  - [Resolvers](#resolvers)
- [Routing (Interceptors)](#routing-interceptors)
- [Routing (Lazy Loading)](#routing-lazy-loading)
  - [Pre-loading modules](#pre-loading-modules)
- [NgRx (Modern Syntax)](#ngrx-modern-syntax)

## Routing (Basics)

[🔝](#course-notes)

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

[🔝](#course-notes)

There are 3 kinds of routing services that I know of.

### Auth Guards: Activated Guards

[🔝](#course-notes)

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

[🔝](#course-notes)

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

[🔝](#course-notes)

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

[🔝](#course-notes)

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

## Routing (Lazy Loading)

[🔝](#course-notes)

Lazy loading means when we navigate to a route, we load only the module associated with _that_ route. Only when we visit another route do we load the module associated to the other route.

Thus, splitting the code into multiple modules is a prerequisite for lazy loading, at least in a module-based project (non-standalone).

The code for lazy loading is written in your routes array. The module that you want to be loaded lazily should be passed as an `import` function argument to the `loadChildren` attribute of a route object, and resolved as a promise, like this:

```ts
const routes: Routes = [
  {
    path: "route-address",
    loadChildren: () =>
      import("path-to-your-module").then((m) => m.NameOfModule),
  },
];
```

For example, in the routing module [file](./course-project/src/app/app-routing.module.ts) of recipes, this is how the lazy-loading is written.

```ts
const routes: Routes = [
  { path: "", redirectTo: "/recipes", pathMatch: "full" },
  {
    path: "recipes",
    loadChildren: () =>
      import("./recipes/recipes.module").then((m) => m.RecipesModule),
  },
  {
    path: "shopping-list",
    loadChildren: () =>
      import("./shopping-list/shopping-list.module").then(
        (m) => m.ShoppingListModule
      ),
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
];
```

**Note.** If you are lazily-loading a module, you should not load it eagerly as well. This means all the modules mentioned in the inside `loadChildren` functions of the `routes` array should _not_ be added in the `imports` array of the app-module.ts file.

### Pre-loading modules

[🔝](#course-notes)

This can be used to make sure after the initial small bundle is loaded, the app continues to load other lazily-loaded routes in the mean time, so that there is less delay when the user would visit those routes.

To implement this, import `PreloadAllModules` from @angular/router, and pass it as a value to `preloadingStrategy` in the `forRoot` method of the `RouterModule`, as shown below, and done in the same file.

```ts
@NgModule({
  imports: [
    RouterModule.forRoot(
        routes,
        { preloadingStrategy: PreloadAllModules }  // this line
    ),
  ],
  exports: [RouterModule],
})
```

## NgRx (Modern Syntax)

[🔝](#course-notes)

### Installations

First, install it with the following command.

```sh
ng add @ngrx/store
```

This will install the NgRx store package and modify the app.module.ts [file](./15-ngrx-without-standalone/src/app/app.module.ts) like this:

```ts
imports: [
  // ...
  StoreModule.forRoot({}, {}),
  // ...
];
```

[Later](#handling-side-effects), side-effects will also be handled, with another package by NgRx. This can be installed like:

```sh
ng add @ngrx/effects
```

It will add the following change in the `imports` array of app.module.ts file:

```ts
imports: [
  // ...
  EffectsModule.forRoot([]),
  // ...
];
```

### Store setup

Create a new folder for the store (not mandatory but considered a best practice), and inside of it create a reducer [file](./15-ngrx-without-standalone/src/app/store/counter.reducer.ts) (here, it's the counter.reducer.ts file.). Inside of this file, set up an initial state, and use it to create a reducer.

```ts
import { createReducer } from "@ngrx/store";
const initialState = 0;
export const counterReducer = createReducer(initialState);
```

Next, add this reducer in the app.module.ts file with a reducer name (key) and this reducer object (value), like:

```ts
StoreModule.forRoot({
  counter: counterReducer,
});
```

### Using selectors

To get the value of a reducer from a store, a selector is needed. This is done by injecting the `Store` service in the constructor of the component where this value is needed, and passing the reducer name in the `select` method of its object.

In the counter project [file](./15-ngrx-without-standalone/src/app/counter-output/counter-output.component.ts), it is done like this:

```ts
count$: Observable<number>;
constructor(store: Store<counterModel>) {
    this.count$ = store.select('counter');
}
```

The value of this observable can then be shown in the HTML template [file](./15-ngrx-without-standalone/src/app/counter-output/counter-output.component.html) using the `async` pipe.

```html
<p class="counter">{{ count$ | async }}</p>
```

We can also pass a function as parameter to the `select` method, but that is done [below](#selector-functions-and-layering).

### Creating actions

Actions are dispatched whenever the state of a reducer needs changing. While they don't contain the state change logic, they are linked to the said logic inside the reducer.

To create an action, we need an action name (first parameter), and an object that contains the value needed for the state change (second parameter) passed inside the `createAction` function. Make sure the action name is unique.

Example:

```ts
import { createAction, props } from "@ngrx/store";

export const increment = createAction(
  "COUNTER:INCREMENT",
  props<{ value: number }>()
);
```

As a best practice, create all actions in their own action [file](./15-ngrx-without-standalone/src/app/store/counter.actions.ts). Also, action names should be unique throughout the store (and not just reducer), so make sure to put the reducer name (here "COUNTER") in the action name along with its purpose (here"INCREMENT").

### Linking actions to state change logic

This is done in the reducer. Inside the reducer, we can add multiple actions with their logic for state change in the `on` function.

The `on` function takes the action object (imported from the action ts file) as its first argument, and an inline function where the state changes as the second argument.

It can be written like this:

```ts
import { createReducer, on } from "@ngrx/store";
import { increment } from "./counter.actions";

const initialState = 0;

export const counterReducer = createReducer(
  initialState,
  on(increment, (prevState, props) => prevState + props.value)
);
```

Here, for the counter, we are setting the inital state as 0. Then, when the `increment` option is dispatched, we are increasing the value of the state by `props.value`. The previous state is automatically provided by NgRx as the first parameter of this inline function.

### Dispatching actions

This is pretty simple. You just have to import the action from the actions TS file, and pass it to the `dispatch` method of the store object.

Syntax:

```ts
import { actionObject } from "path-to-actions-file";
import { Store } from '@ngrx/store';

// ... then inside the class
    constructor(private store: Store<typeOfStore>) {}

    methodForDispatchingAction() {
        const actionProp = {propName: propVal}
        this.store.dispatch(actionObject(actionProp));
    }
```

Example, in the counter controls [file](./15-ngrx-without-standalone/src/app/counter-controls/counter-controls.component.ts):

```ts
import { Store } from '@ngrx/store';
import { increment } from '../store/counter.actions';
import { counterModel } from '../store/store.model';

// ... then inside the class
  constructor(private store: Store<counterModel>) {}

  increment() {
    this.store.dispatch(increment({ value: 1 }));
  }
```

This method can be bound to a button in the HTML template [file](./15-ngrx-without-standalone/src/app/counter-controls/counter-controls.component.html), so that pressig on it changes the state.

```html
<button (click)="increment()">Increment</button>
```

### Selector functions and layering

As a best practice, all selectors should be defined in their own [file](./15-ngrx-without-standalone/src/app/store/counter.selectors.ts).

A selector, like seen above, can take a string parameter to get the selector from the store, but it can also take a function parameter. Such a selector is defined, for example, like this:

```ts
export const countSelector = (state: counterModel) => state.counter;
```

The paramter this function receives is the overall state of the store, and it returns the reducer specified. This approach is preferred over the string-based approach in complex applications where the same reducer is being used in multiple places, having a central location, like a selector file, to access it is more streamline.

We can then use it in the component file like this:

```ts
import { countSelector } from "../store/counter.selectors";

// then inside the constructor
this.count$ = store.select(countSelector);
// instead of: this.count$ = store.select('counter');
```

We can also layer selectors using the `createSelector` function, which takes the inline function as an argument. In this inline function we put multiple functions, and the return value of one the current function is the input to the next. The value returned in the final function is the return value of the overall function.

Example:

```ts
import { createSelector } from "@ngrx/store";
import { counterModel } from "./store.model";

export const countSelector = (state: counterModel) => state.counter;
export const doubleCountSelector = createSelector(
  countSelector,
  (state) => state * 2
);
```

Here, it is simply returning the doubled value of the value returned by the counter reducer.

### Handling side-effects

A side-effect is any code we wish to execute when an action gets dispatched that does not directly result in a state change. For example, with the value of the state upon dispatching an action, we wish to send an HTTP request. This should not be written inside the reducer function, as it will result in unperceivable instability in the application. Instead, this should be handled separately, and here, with the effects.

To start, as a best practice, create a [file](./15-ngrx-without-standalone/src/app/store/counter.effects.ts) containing all the effects.

Now, if we want to store the new state value in locala storage and log the action, for example, we will first have to create a class in this effects file. In this class, we inject the store and the actions, so something like:

```ts
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
export class CounterEffefcts {
  constructor(private actions$: Actions, private store: Store<counterModel>);
}
```

Now inside this class we create a new action called `saveCount` using `createEffect` function imported from @ngrx/effects. The first parameter it takes is an inline function, where we `pipe` the actions injected. Inside this pipe we pass some arguments: the first is calling `ofType`. We want this effect too happen every time the increment or decrement actions are dispatched, so we pass those two arguments here. Next, we want the action and counter data after these actions are dispatched. For that, we use `withLatestFrom` function and pass the counter selector. Finally, we write the logging and storing logic in the `tap` function, as shown below:

```ts
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { decrement, increment } from "./counter.actions";
import { tap, withLatestFrom } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { counterModel } from "./store.model";
import { countSelector } from "./counter.selectors";

@Injectable()
export class CounterEffects {
  saveCount = createEffect(
    () =>
      this.actions$.pipe(
        ofType(increment, decrement),
        withLatestFrom(this.store.select(countSelector)),
        tap(([action, counter]) => {
          console.log({ action });
          localStorage.setItem("count", counter.toString());
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store<counterModel>) {}
}
```

The second parameter passed is `{disptach: false}` so that a new action is not dispatched once the effect is done (default is `true`). Lastly, this class is be made `Injectable`.
