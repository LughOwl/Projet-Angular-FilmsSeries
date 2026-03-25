import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
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
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
