import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigerPage } from './naviger.page';

const routes: Routes = [
  {
    path: '',
    component: NavigerPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NaviguerPageRoutingModule {}
