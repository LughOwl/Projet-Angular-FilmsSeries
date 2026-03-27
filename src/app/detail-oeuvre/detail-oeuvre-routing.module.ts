import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailOeuvrePage } from './detail-oeuvre.page';

const routes: Routes = [
  {
    path: '',
    component: DetailOeuvrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailOeuvrePageRoutingModule {}
