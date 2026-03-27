import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailOeuvrePageRoutingModule } from './detail-oeuvre-routing.module';

import { DetailOeuvrePage } from './detail-oeuvre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailOeuvrePageRoutingModule
  ],
  declarations: [DetailOeuvrePage]
})
export class DetailOeuvrePageModule {}
