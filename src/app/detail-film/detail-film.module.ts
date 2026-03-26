import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailFilmPageRoutingModule } from './detail-film-routing.module';

import { DetailFilmPage } from './detail-film.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailFilmPageRoutingModule
  ],
  declarations: [DetailFilmPage]
})
export class DetailFilmPageModule {}
