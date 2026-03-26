import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NaviguerPage } from './naviguer.page';

const routes: Routes = [
  {
    path: '',
    component: NaviguerPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NaviguerPageRoutingModule {}
