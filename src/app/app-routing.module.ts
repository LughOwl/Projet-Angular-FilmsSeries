import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'detail-film', // Le chemin doit correspondre à celui du router.navigate
    loadChildren: () => import('./detail-film/detail-film.module').then(m => m.DetailFilmPageModule)
  },
  {
    path: 'detail-film',
    loadChildren: () => import('./detail-film/detail-film.module').then( m => m.DetailFilmPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
