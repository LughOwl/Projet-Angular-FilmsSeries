import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {AccueilPageRoutingModule} from "../accueil/accueil-routing.module";

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'accueil',
        loadChildren: () => import('../accueil/accueil.module').then(m => m.AccueilPageModule)
      },
      {
        path: 'films',
        loadChildren: () => import('../films/films.module').then(m => m.FilmsPageModule)
      },
      {
        path: 'naviguer',
        loadChildren: () => import('../naviguer/naviguer.module').then(m => m.NaviguerPageModule)
      },
      {
        path: 'series',
        loadChildren: () => import('../series/series.module').then(m => m.SeriesPageModule)
      },
      {
        path: 'parametres',
        loadChildren: () => import('../parametres/parametres.module').then(m => m.ParametresPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/accueil',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/accueil',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
