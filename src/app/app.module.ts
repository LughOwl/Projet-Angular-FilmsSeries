import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListeFilmsComponent } from './components/liste-films/liste-films.component';
import { DetailsFilmComponent } from './components/details-film/details-film.component';

@NgModule({
  declarations: [
    AppComponent,
    ListeFilmsComponent,
    DetailsFilmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}