import { enableProdMode } from "@angular/core";
import { environment } from "./environments/environment";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

// this is how you bootstrap your application with a component, instead of a module
bootstrapApplication(
  AppComponent
  // this is how you would provide the service to the root if you weren't using providedIn
  // {
  //   providers: [AnalyticsService]
  // }
);
