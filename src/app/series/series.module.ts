import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeriesPage } from './series.page';
import { SeriesPageRoutingModule } from './series-routing.module';
import {CardOeuvreComponent} from "../card-oeuvre/card-oeuvre.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SeriesPageRoutingModule,
    CardOeuvreComponent
  ],
  declarations: [SeriesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeriesPageModule {}
