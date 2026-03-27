import { IonicModule } from '@ionic/angular';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccueilPage } from './accueil.page';
import { AccueilPageRoutingModule } from './accueil-routing.module';
import {CardOeuvreComponent} from "../card-oeuvre/card-oeuvre.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AccueilPageRoutingModule,
    CardOeuvreComponent
  ],
  declarations: [AccueilPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccueilPageModule {}
