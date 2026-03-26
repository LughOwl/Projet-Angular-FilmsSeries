import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailFilmPage } from './detail-film.page';

const routes: Routes = [
  {
    path: '',
    component: DetailFilmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailFilmPageRoutingModule {}
