import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeFilmsComponent } from './components/liste-films/liste-films.component';
import { DetailsFilmComponent } from './components/details-film/details-film.component';

const routes: Routes = [
  { path: '', component: ListeFilmsComponent },
  { path: 'details/:id', component: DetailsFilmComponent },
  // Conserver les autres routes existantes si nécessaire
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}