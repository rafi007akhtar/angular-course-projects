import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StatusFilter } from './statusFilter.pipe';
import { AppComponent } from './app.component';
import { ShortenPipe } from './shorten.pipe';
import { ReverseStrPipe } from './reverse-str.pipe';
import { SortByNamePipe } from './sort-by-name.pipe';

@NgModule({
  declarations: [AppComponent, ShortenPipe, StatusFilter, ReverseStrPipe, SortByNamePipe],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
